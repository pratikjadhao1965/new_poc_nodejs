const Order=require("../models/order.js")
const Item=require("../models/item")
const User=require("../models/user")
const mongoose=require("mongoose")

exports.place_order=async(req,res)=>{
    try{
    req.body.products.map(item=>{
        item.status="in-transit"
    })
    const order=new Order({
        owner:req.user._id,
        ...req.body
    })
    let flag=true
    req.user.addresses.map(address=>{
        if(address.location===req.body.deliveryAddress.location&&
            address.city===req.body.deliveryAddress.city&&
            address.pincode==req.body.deliveryAddress.pincode&&
            address.state===req.body.deliveryAddress.state&&
            address.name===req.body.deliveryAddress.name&&
            address.phone==req.body.deliveryAddress.phone)
            {
                flag=false
            }
    })
    if(flag){
    await User.updateOne({_id:req.user.id},{$addToSet:{addresses:req.body.deliveryAddress}})
    }
    await order.save()
    res.status(200).send(order)
    }
    catch(error){
        res.status(400).send({error:"something went wrong"})
    }
}

//get orders
exports.get_allOrders=async(req,res)=>{
    try{
    const order=await Order.find()
    res.status(200).send(order)
    }
    catch(error){
        res.status(400).send(error)
    }
}

//get user orders

exports.get_orders=async(req,res)=>{
    try{
    const orders=await Order.find({owner:req.user._id})
    if(!orders[0]){
        throw new Error("orders not found")
    }
    res.status(200).send(orders)
    }
    catch(error){
        res.status(404).send(error.message)
    }
}

//get order by id

exports.get_order=async(req,res)=>{
    try{
    const order=await Order.findById(req.params.id)
    res.status(200).send(order)
    }
    catch(error){
        res.status(400).send(error)
    }
}


//delete order using id

exports.delete_order=async(req,res)=>{
    try{
        const order= await Order.findByIdAndDelete({_id:req.params.id,owner:req.user._id})
        
        order.products.map(async(product)=>{
            await Item.findByIdAndUpdate(product._id,{$inc:{stock:product.quantity}})
        })
        res.status(200).send(order)
    }
    catch(error){
        res.status(400).send({error:"something went wrong!"})
    }

}

