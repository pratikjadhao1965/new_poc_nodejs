const request=require("supertest")
const app=require("../src/app.js")
const Shop=require("../src/models/shop.js")
const {shopOne,shopOneId,setupDatabase}=require("./fixtures/db.js")



beforeEach(setupDatabase)

test('should sign up a new shop',async()=>{
    const response=await request(app).post("/api/shops").send({
        shopName: "om store",
        ownerName: "pratik jadhao",
        email: "pratika@gmail.com",
        password:"12345678",
        phone: 918928399,
        location: "anjangaon"
    }).expect(201)

    //asesert that database was changed successfully
    const shop=await Shop.findById(response.body.shop._id)
    expect(shop).not.toBeNull()

    //assertion about the response
    expect(response.body).toMatchObject({
        shop:{
            shopName:"om store",
            email:"pratika@gmail.com"
        },
        token:shop.tokens[0].token
    })

    expect(shop.password).not.toBe("12345678")
})



test("should login a shop",async()=>{
    const response=await request(app).post("/api/shops/login").send({
        email:shopOne.email,
        password:shopOne.password
    }).expect(200)

    const shop=await Shop.findById(shopOneId)
    expect(response.body.token).toBe(shop.tokens[1].token)
})

test("should not login a non existing shop",async()=>{
    await request(app).post("/api/shops/login").send({
        email:shopOne.email,
        password:'thisisnotmypass'
        }).expect(400)
})

test("should get profile for shop",async()=>{
    await request(app)
        .get("/api/shops/me")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test("should not get profile for unauthenticated user",async()=>{
    await request(app)
        .get("/api/shops/me")
        .send()
        .expect(401)
})


test("should delete a authenticated shop",async()=>{
    const response=await request(app)
        .delete("/api/shops/me")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send()
        .expect(200)
    
        const shop=await Shop.findById(shopOneId)
        expect(shop).toBeNull()
})

test("should not delete a unauthenticated shop",async()=>{
    await request(app)
        .delete("/api/shops/me")
        .send()
        .expect(401)
})

test("should upload avatar",async()=>{
    await request(app)
        .post("/api/shops/me/avatar")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .attach("avatar",'tests/fixtures/img.png')
        .expect(200)

        const shop=await Shop.findById(shopOneId)
        expect(shop.avatar).toEqual(expect.any(Buffer))
})

test("should update valid shop fields",async()=>{
    await request(app)
        .patch("/api/shops/me")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send({
            shopName:"raj store"
        }).expect(201)

        const shop=await Shop.findById(shopOneId)
        expect(shop.shopName).toEqual("raj store")
})


test("should not update invalid shop fields",async()=>{
    await request(app)
        .patch("/api/shops/me")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send({
            height:"raj"
        }).expect(400)
})