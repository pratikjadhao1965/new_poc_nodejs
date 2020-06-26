const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const shopSchema=new mongoose.Schema({
    shopName:{
        type:String,
        required:true,
        trim:true
    },
    ownerName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,  
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password contains string 'password'")
            }
        }      
    },
    phone:{
        type:Number,
        required:true,
        trim:true,
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


shopSchema.virtual('shopItems',{
    ref:'Item',
    localField:'_id',
    foreignField:'shopId'
})

shopSchema.methods.toJSON= function(){
    const shop=this
    const shopObject=shop.toObject()

    delete shopObject.password
    delete shopObject.tokens
    delete shopObject.avatar

    return shopObject
}

shopSchema.methods.generateAuthToken=async function(){
    const shop=this
    const token=jwt.sign({_id:shop._id.toString()},process.env.JWT_SECRET)
    shop.tokens=shop.tokens.concat({token})
    await shop.save()
    return token
}


shopSchema.statics.findByCredentials=async(email,password)=>{
    const shop=await Shop.findOne({email})

    if(!shop){
        throw new Error("unable to login")
    }
    const isMatch=await bcrypt.compare(password,shop.password)
    if(!isMatch){
        throw new Error("unable to login")
    }
    return shop
}
//hashing password
shopSchema.pre("save",async function(next){
    const shop=this

    if(shop.isModified("password")){
        shop.password=await bcrypt.hash(shop.password,8)
    }
    
    next()
})

// delete items when user is deleted
shopSchema.pre('remove',async function(next){
    const shop=this
    await Item.deleteMany({shopId:shop._id})
    next()
})


const Shop=mongoose.model("Shop",shopSchema)

module.exports=Shop