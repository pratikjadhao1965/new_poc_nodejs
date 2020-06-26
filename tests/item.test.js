const request=require("supertest")
const app=require("../src/app.js")

const Item=require("../src/models/item.js")
const mongoose=require("mongoose")


const {
    shopOne,
    shopOneId,
    shopTwo,
    shopTwoId,
    itemOne,
    setupDatabase}=require("./fixtures/db")

beforeEach(setupDatabase)

test("should create item",async()=>{
   const response=await request(app)
        .post("/api/items")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send({
            _id:new mongoose.Types.ObjectId(),
            name: "grapes",
            price: 112,
            catagory: "fruit",
            shopId: shopOneId,
            description: "500 grams",
            quantity: 200
        })
        .expect(201)

        const item=await Item.findById(response.body._id)
        expect(item).not.toBeNull()
})

test("should fetch user item",async()=>{
    const response=await request(app)
        .get("/api/items")
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})


test("delete shop item",async()=>{
    const response=await request(app)
        .delete(`/api/items/${itemOne._id}`)
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send()
        .expect(200)

    const item=await Item.findById(itemOne._id)
    expect(item).toBeNull()
    
})

test("should not delete invalid item shop",async()=>{
    const response=await request(app)
        .delete(`/api/items/${new mongoose.Types.ObjectId()}`)
        .set("Authorization",`Bearer ${shopOne.tokens[0].token}`)
        .send()
        .expect(404)
})