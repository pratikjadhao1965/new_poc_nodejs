const jwt=require("jsonwebtoken")
const Shop=require("../models/shop.js")

const authShop=async(req,res,next)=>{
    try{
        const token=req.header("Authorization").replace("Bearer ","")
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const shop=await Shop.findOne({_id:decoded._id,"tokens.token":token})
        if(!shop){
            throw new Error()
        }
        req.token=token
        req.shop=shop
        next()
    }catch(e){
        res.status(401).send({error:"please authenticate"})
    }
}

module.exports=authShop