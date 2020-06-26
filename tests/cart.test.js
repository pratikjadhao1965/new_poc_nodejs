const request=require("supertest")
const app=require("../src/app.js")
const User=require("../src/models/user.js")
const Cart=require("../src/models/cart.js")
const mongoose=require("mongoose")


const {
    // userOne,
    // userOneId,
    // userTwo,
    // userTwoId,
    cartOne,
    shopOne,
    itemOne,
    
    setupDatabase}=require("./fixtures/db")

beforeEach(setupDatabase)

test("should create cart for user",async()=>{
   const response=await request(app)
        .post("/api/carts/save")
        //.set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send({
        total: 0,
        cartItems: [{
            quantity: 1,
            _id: itemOne._id
        }]
        })
        .expect(201)

        const cart=await Cart.findById(response.body._id)
        expect(cart).not.toBeNull()
})

test("should fetch user cart",async()=>{
    const response=await request(app)
        .get("/api/carts")
        //.set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})

test("should not delete invalid user cart",async()=>{
    const response=await request(app)
        .delete(`/api/carts/${new mongoose.Types.ObjectId()}`)
        //.set("Authorization",`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    
})


test("delete user cart",async()=>{
    const response=await request(app)
        .delete(`/api/carts/${cartOne._id}`)
        //.set("Authorization",`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)

    const cart=await Cart.findById(cartOne._id)
    expect(cart).toBeNull()
    
})
