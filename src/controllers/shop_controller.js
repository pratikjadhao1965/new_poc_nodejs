const sharp=require("sharp") 
const Shop=require("../models/shop.js")
const {sendWelcomeEmail,sendCancelationEmail}=require("../emails/account.js")

//create shop 
exports.create_shop=async(req,res)=>{
    const shop =new Shop(req.body)
    try{
        await shop.save()
        sendWelcomeEmail(shop.email,shop.name)
        const token=await shop.generateAuthToken()
        res.status(201).send({shop,token})
    }catch(error){
        res.status(400).send(error)
    }
}

//login to shop
exports.login_shop=async(req,res)=>{
    try{
        const shop=await Shop.findByCredentials(req.body.email,req.body.password)
        const token=await shop.generateAuthToken()
        res.status(200).send({shop,token})
    }catch(error){
        res.status(400).send(error)
    }
}

//logout all shop
exports.logoutAll_shop=async(req,res)=>{
    try{
        req.shop.tokens=[]
        await req.shop.save()
        res.send(req.shop)
    }catch(error){
        res.status(500).send(error)
    }
}

//logout current shop
exports.logout_shop=async(req,res)=>{
    try{
        req.shop.tokens=req.shop.tokens.filter((token)=>{
        return token.token!==req.token
        })
        await req.shop.save()
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
}

//get shop profile
exports.get_shopProfile=async(req,res)=>{
    res.send(req.shop)
}

//update shop profile
exports.update_shopProfile=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["shopName","ownerName","email","password","phone","location"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        updates.forEach((update)=>req.shop[update]=req.body[update])
        req.shop.save()
        res.status(201).send(req.shop)
    }catch(error){
        res.status(500).send(error)
    }
}

//delete shop profile
exports.delete_shopProfile=async(req,res)=>{
    try{
        const shop=await Shop.findByIdAndDelete(req.shop.id)
        sendCancelationEmail(req.shop.email,req.shop.name)
        res.send(req.shop)
    }catch(error){
        res.status(500).send(error)
    }
}

//upload avatar
exports.upload_avatar=async(req,res)=>{
    try{
    const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()

    req.shop.avatar=buffer
    await req.shop.save()
    res.status(200).send()
    }catch(error){
    res.status(400).send({"error":error.message})
    }
}

//delete avatar
exports.delete_avatar=async(req,res)=>{
    try{
    req.shop.avatar=undefined
    await req.shop.save()
    res.status(200).send()
    }catch(error){
    res.status(400).send({"error":error.message})
    }
}

//get avatar
exports.get_avatar=async(req,res)=>{
    try{
    const shop=await Shop.findById(req.params.id)
    if(!shop||!shop.avatar){
        throw new Error("not found")
    }
    res.set("Content-Type","image/png")
    res.send(shop.avatar)
    }catch(error){
    res.status(400).send({"error":error.message})
    }
}

