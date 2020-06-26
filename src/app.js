const express=require("express")
const cors=require("cors")
require("./db/mongoose.js")
const userRouter=require("./router/user.js")
const cartRouter=require("./router/order.js")
const itemRouter=require("./router/item.js")
const shopRouter=require("./router/shop.js")

const app=express()

 app.use(express.json())
 app.use(cors())
 app.use(process.env.API_BASE_URL,userRouter)
 app.use(process.env.API_BASE_URL,cartRouter)
 app.use(process.env.API_BASE_URL,itemRouter)
 app.use(process.env.API_BASE_URL,shopRouter)
 
module.exports=app
