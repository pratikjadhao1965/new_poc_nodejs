const request=require("supertest")
const app=require("../src/app.js")
const User=require("../src/models/user.js")
const {userOne,userOneId,setupDatabase}=require("./fixtures/db.js")



beforeEach(setupDatabase)

test('should sign up a new user',async()=>{
    const response=await request(app).post("/api/users").send({
        name:"pratik jadhao", 
        email: "pratikjadha@gmail.com",
        password: "12345678",
        phone: 8276514534,
        
        age: 21,
        gender:"male"
    }).expect(201)

    //asesert that database was changed successfully
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name:"pratik jadhao",
            email:"pratikjadha@gmail.com"
        },
        token:user.tokens[0].token
    })

    expect(user.password).not.toBe("12345678")
})

test("should login a user",async()=>{
    const response=await request(app).post("/api/users/login").send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user=await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("should not login a non existing user",async()=>{
    await request(app).post("/api/users/login").send({
        email:userOne.email,
        password:'thisisnotmypass'
        }).expect(400)
})

test("should get profile for user",async()=>{
    await request(app)
        .get("/api/users/me")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test("should not get profile for unauthenticated user",async()=>{
    await request(app)
        .get("/api/users/me")
        .send()
        .expect(401)
})


test("should delete a authenticated user",async()=>{
    const response=await request(app)
        .delete("/api/users/me")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
        const user=await User.findById(userOneId)
        expect(user).toBeNull()
})

test("should not delete a unauthenticated user",async()=>{
    await request(app)
        .delete("/api/users/me")
        .send()
        .expect(401)
})

test("should upload avatar",async()=>{
    await request(app)
        .post("/api/users/me/avatar")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .attach("avatar",'tests/fixtures/img.png')
        .expect(200)

        const user=await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))
})

test("should update valid user fields",async()=>{
    await request(app)
        .patch("/api/users/me")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send({
            name:"raj"
        }).expect(201)

        const user=await User.findById(userOneId)
        expect(user.name).toEqual("raj")
})


test("should not update invalid user fields",async()=>{
    await request(app)
        .patch("/api/users/me")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send({
            location:"raj"
        }).expect(400)
})