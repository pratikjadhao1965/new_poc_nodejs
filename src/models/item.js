const mongoose=require("mongoose")
const validator=require("validator")

const itemSchema=new mongoose.Schema({
        name:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            unique:true
        },
        price:{
            type:Number,
            required:true,
            trim:true
        },
        shopId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            trim:true
        },
    catagory:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    reviews:[{
        body:{
            type:String,
            trim:true,
        },
        email:{
            type:String,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("email is invalid")
                }
            }
        },
        name:{
            type:String,
            trim:true,
            lowercase:true
        }
    }],
    image:{
        type:Buffer
    }

},{
    timestamps:true
})
itemSchema.methods.toJSON= function(){
    const item=this
    const itemObject=item.toObject()
    delete itemObject.image
    return itemObject
}


const Item=mongoose.model("Item",itemSchema)

module.exports=Item