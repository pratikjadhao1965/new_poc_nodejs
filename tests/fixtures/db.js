const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const User=require("../../src/models/user.js")
const Cart=require("../../src/models/cart.js")
const Item=require("../../src/models/item.js")
const Shop=require("../../src/models/shop.js")
const userOneId=new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:"kiran jadhao",
    email:"kiran@gmail.com",
    password:"12345678",
    age:26,
    phone: 8276514534,
    gender:"male",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }] 
}
// const userTwoId=new mongoose.Types.ObjectId()
// const userTwo={
//     _id:userTwoId,
//     name:"p jadhao",
//     email:"2016bit023@sggs.ac.in",
//     password:"0123456789",
//     age:22,
//     phone: 8276514534,
//     gender:"male",
//     tokens:[{
//         token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
//     }] 
// }

const cartOne={
    _id:new mongoose.Types.ObjectId(),
    total: 0,
    checkedOut: true,
    cartItems: [],
    payment: "card",
    owner:userOneId
}

// const cartTwo={
//     _id:new mongoose.Types.ObjectId(),
//     total: 0,
//     checkedOut:true,
//     cartItems: [],
//     payment: "card",
//     owner:userOneId
// }

// const cartThree={
//     _id:new mongoose.Types.ObjectId(),
//     total: 0,
//     checkedOut: false,
//     cartItems: [],
//     payment: "card",
//     owner:userTwoId
// }


const shopOneId=new mongoose.Types.ObjectId()

const shopOne={
    _id:shopOneId,
    shopName: "om store",
    ownerName: "pratik jadhao",
    email: "pratik@gmail.com",
    password:"12345678",
    phone: 918928399,
    location: "anjangaon",
    tokens:[{
        token:jwt.sign({_id:shopOneId},process.env.JWT_SECRET)
    }] 
}

// const shopTwoId=new mongoose.Types.ObjectId()

// const shopTwo={
//     _id:shopTwoId,
//     shopName: "om store1",
//     ownerName: "pratik jadhao",
//     email: "pratikjadhao@gmail.com",
//     password:"12345678",
//     phone: 918928399,
//     location: "anjangaon",
//     tokens:[{
//         token:jwt.sign({_id:shopTwoId},process.env.JWT_SECRET)
//     }] 
// }

const itemOne={
    _id:new mongoose.Types.ObjectId(),
    name: "banana",
    price: 144,
    catagory: "fruit",
    shopId: shopOneId,
    description: "6 pieces",
    quantity: 200
}

// const itemTwo={
//     _id:new mongoose.Types.ObjectId(),
//     name: "apple",
//     price: 60,
//     catagory: "fruit",
//     shopId: shopOneId,
//     description: "6 pieces",
//     quantity: 200
// }

// const itemThree={
//     _id:new mongoose.Types.ObjectId(),
//     name: "grapes",
//     price: 112,
//     catagory: "fruit",
//     shopId: shopTwoId,
//     description: "500 grams",
//     quantity: 200
// }

     
 const setupDatabase=async()=>{
    await User.deleteMany()
    await Cart.deleteMany()
    await Item.deleteMany()
    await Shop.deleteMany()
    await new User(userOne).save()
    //await new User(userTwo).save()
    await new Cart(cartOne).save()
    // await new Cart(cartTwo).save()
    // await new Cart(cartThree).save()
    await new Shop(shopOne).save()
    // await new Shop(shopTwo).save()
     await new Item(itemOne).save()
    // await new Item(itemTwo).save()
    // await new Item(itemThree).save()
}
    module.exports={
     userOneId,
    userOne,
    //    userTwoId,
    //    userTwo,
     cartOne,
        shopOne,
        shopOneId,
        // shopTwo,
        // shopTwoId,
        itemOne,
        // itemTwo,
        // itemThree,
        setupDatabase
    }