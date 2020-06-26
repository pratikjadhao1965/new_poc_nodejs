const mongoose=require("mongoose")
const sharp=require("sharp") 
const User=require("../models/user.js")
const Item=require("../models/item")
const bcrypt=require("bcryptjs")
const {sendWelcomeEmail,sendCancelationEmail}=require("../emails/account.js")

//create user
exports.create_user=async(req,res)=>{
    const user =new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(error){
        
        res.status(403).send("email exists")
    }
}
    
//login user
exports.login_user=async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()

        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }
}

//logout all user
exports.logoutAll_users=async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
}

//logout user
exports.logout_user=async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
            res.status(500).send(e)
    }
}

//get user profile
exports.get_userProfile=async(req,res)=>{
    res.send(req.user)
}

//get user using id
exports.get_user=async(req,res)=>{
    const _id=req.params.id

    try{
        const user=await User.findById({_id})
        if(!user){
            res.status(404).send()
        }   
        res.send(user)    
    }catch(error){
        res.status(500).send(error)
    }
}

//update user profile
exports.update_userProfile=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","phone","age","gender"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        req.user.save()
        res.status(201).send({success:"profile updated!"})
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
}

exports.update_userPassword=async(req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=["newPassword","prevPassword"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid||req.body.prevPassword===req.body.newPassword){
        return res.status(400).send({error:"check fields!"})
    }
    try{
        const isMatch=await bcrypt.compare(req.body.prevPassword,req.user.password)
        if(!isMatch){
            return res.status(400).send({error:"previous password does not match!"})
        }
        req.user.password=req.body.newPassword
        req.user.save()
        res.status(201).send({success:"password changed!"})
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
}

//update addresses in user
exports.update_userAddress=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["location","area","pincode","city","state","name","phone"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        updates.forEach(async(update)=>{
         if(update==="location"){
         await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.location":req.body[update]}})
         }
         else if(update==="area"){
            await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.area":req.body[update]}})
            }
            else if(update==="pincode"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.pincode":req.body[update]}})
            }else if(update==="city"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.city":req.body[update]}})
            }else if(update==="state"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.state":req.body[update]}})
            }else if(update==="name"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.name":req.body[update]}})
            }else if(update==="phone") {
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.phone":req.body[update]}})
            } 
        })
        const user=await User.findById(req.user._id)
        res.status(201).send(user)
    }catch(error){
        res.status(500).send(error)
    }
}

exports.get_addresses=async(req,res)=>{
    try{
    res.status(200).send(req.user.addresses)
    }catch(error){
        res.status(500).send(error)
    }

}
//add address to user
exports.add_userAddress=async(req,res)=>{
    
    try{
       
            await User.findOneAndUpdate({_id:req.user._id},{$addToSet:{addresses:req.body}})
            const address= await User.findById(req.user._id)
            res.status(201).send(address)
        // }else{
        //     throw error("address present")
        // }
    }catch(error){
        res.status(500).send(error)
    }

}

//delete user address
exports.delete_userAddress=async(req,res)=>{
    try{
        const user=await User.findOneAndUpdate({_id:req.user.id},{$pull:{addresses:{_id:req.params.id}}})
            res.status(201).send(user)
    }catch(error){
        res.status(500).send(error)
    }

}

//delete user profile
exports.delete_profile=async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.user.id)
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
}

//upload avatar
exports.upload_avatar=async(req,res)=>{
    const buffer=await sharp(req.file.buffer).toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.status(200).send({_id:req.user._id})
},(error,req,res,next)=>{
    res.status(400).send({"error":error.message})
}

//delete avatar
exports.delete_avatar=async(req,res)=>{
    try{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send()
}
    catch(error){
        res.status(400).send({"error":error.message})
    }
 }

 //get avatar
exports.get_avatar=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
        throw new Error("not found")
    }
    res.set("Content-Type","image/png")
    res.status(200).send(user.avatar)
    }catch(error){
        res.status(400).send({"error":error.message})
    }
    
}



//Cart controllers

//get user cart
exports.get_cart=async(req,res)=>{
    try{      
        res.send(req.user)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }

}

//getting user cart by populating
exports.get_detailedcart=async(req,res)=>{

    try{
        
        await req.user.populate("cart._id").execPopulate()
        res.send(req.user)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
  
}

//delete cart
exports.delete_cart=async(req,res)=>{
    try{
        const user=await User.findOneAndUpdate({_id:req.user._id},{$set:{cart:[]}})
        res.send(user.cart)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
}

//update cart items
exports.update_cart=async(req,res)=>{
     
    try{
        req.body.map(async(item)=>{
            const index=req.user.cart.findIndex(cartItem=>cartItem._id.toString()===item._id.toString())
            if(index===-1){
                req.user.cart.push(item)
                await Item.findByIdAndUpdate(item._id,{$inc:{stock:-item.quantity}})
            }
        })
        await req.user.save()
        res.status(201).send(req.user.cart)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }

}

exports.add_cartItem=async(req,res)=>{
    try{
        const item=await Item.findById(req.params.id)
        if(item.stock<=0){
            return res.status(400).send({error:"not in stock"})
        }
        const index=req.user.cart.findIndex(item=>item._id.toString()===req.params.id.toString())    
        if(index===-1){
            req.user.cart.push({_id:req.params.id,quantity:1})
            await Item.findByIdAndUpdate(req.params.id,{$inc:{stock:-1}},{new:true,runValidators:true})
        }else{
            req.user.cart[index].quantity= req.user.cart[index].quantity+1
            await Item.findByIdAndUpdate(req.params.id,{$inc:{stock:-1}},{new:true,runValidators:true})
            }
        await req.user.save()
        res.status(201).send(req.user)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
}

exports.remove_cartItem=async(req,res)=>{
    try{
        const index=req.user.cart.findIndex(item=>item._id.toString()===req.params.id.toString())    
        if(index!==-1&&req.user.cart[index].quantity>1){
            req.user.cart[index].quantity= req.user.cart[index].quantity-1
            await Item.findByIdAndUpdate(req.params.id,{$inc:{stock:1}},{new:true,runValidators:true})
        }
             else if(index!==-1&&req.user.cart[index].quantity<=1){
            req.user.cart.splice(index,1)
            await Item.findByIdAndUpdate(req.params.id,{$inc:{stock:1}},{new:true,runValidators:true})
            }
       await req.user.save()
        res.status(201).send(req.user)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }
}

// exports.add_remove_cartItem=async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowedUpdates=["_id","operation"]
//     const isValid=updates.every((update)=> allowedUpdates.includes(update))

//     if(!isValid){
//         return res.status(404).send({error:"invalid update!"})
//     }
//     try{
//         const item=await Item.findById(req.body._id)
//         if(item.stock<=0&&req.body.operation==="add"){
//             return res.status(400).send({error:"not in stock"})
//         }
        
//         const index=req.user.cart.findIndex(item=>item._id.toString()===req.body._id.toString())    
//         if(index===-1&&req.body.operation!=="remove"){
//             item.stock=item.stock-1
//             req.user.cart.push(req.body)
//         }else{
//         updates.forEach(async(update)=>{
//                 if(req.body.operation==="add"&&update==="_id"){
//                     req.user.cart[index].quantity= req.user.cart[index].quantity+1
//                     item.stock=item.stock-1
                    
//                 }
//                 else if(req.body.operation==="remove"&&update==="_id"&&req.user.cart[index]){
//                     item.stock=item.stock+1
//                     if(req.user.cart[index].quantity<=1){
//                         req.user.cart.splice(index,1)
//                     }
//                     else{
//                         req.user.cart[index].quantity= req.user.cart[index].quantity-1
//                     }
                   
                   
//                 }
//             })}
//         await Item.findByIdAndUpdate(item._id,{stock:item.stock},{new:true,runValidators:true})
//         await req.user.save()
//         res.status(201).send(req.user)
//     }catch(error){
//         res.status(500).send(error)
//     }

// }

//remove all cart items
exports.remove_cartItems=async(req,res)=>{
    try{
            await User.findOneAndUpdate({_id:req.user._id},{$set:{cart:[]}})
            const user=await User.findOne({_id:req.user._id})
            await user.save()
            res.status(201).send(user.cart)
    }catch(error){
        res.status(500).send({error:"something went wrong!"})
    }

}

