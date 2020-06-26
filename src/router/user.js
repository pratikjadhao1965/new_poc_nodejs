const express=require("express")
const multer=require("multer")
const user_controller=require("../controllers/user_controller")
const auth=require("../middleware/authUser.js")

const router=new express.Router()
router.post("/users",user_controller.create_user)
router.post("/users/login",user_controller.login_user)
router.delete("/users/logoutAll",auth,user_controller.logoutAll_users)
router.post("/users/logout",auth,user_controller.logout_user)
router.get("/users/me",auth,user_controller.get_userProfile)
router.get("/users/:id",user_controller.get_user)
router.patch("/users/me",auth,user_controller.update_userProfile)
router.patch("/users/me/pass",auth,user_controller.update_userPassword)
router.patch("/users/address/:id",auth,user_controller.update_userAddress)
router.delete("/users/deleteAddress/:id",auth,user_controller.delete_userAddress)
router.patch("/users/addAddress",auth,user_controller.add_userAddress)
router.get("/addresses",auth,user_controller.get_addresses)
router.delete("/users/me",auth,user_controller.delete_profile)

//upload image
const upload=multer({
    limits:{
        fileSize:4000000
    },
    fileFilter(req,file,cd){
        // if(!file.originalname.endsWith(".pdf"))
        if(!file.originalname.match(/\.(jpeg|png|jpg|PNG|JPG|JPEG)$/)){
            return cd(new Error("please upload image"))
        }
        cd(undefined,true)
    }
})
router.post("/users/me/avatar",auth,upload.single('avatar'),user_controller.upload_avatar)
router.delete("/users/me/avatar",auth,user_controller.delete_avatar)
router.get("/users/:id/avatar",user_controller.get_avatar)

//cart
router.get("/carts",auth,user_controller.get_cart)
router.get("/detailedcart",auth,user_controller.get_detailedcart)
router.patch("/carts",auth,user_controller.update_cart)
// router.patch("/carts/item",auth,user_controller.add_remove_cartItem)
router.patch("/carts/additem/:id",auth,user_controller.add_cartItem)
router.patch("/carts/removeitem/:id",auth,user_controller.remove_cartItem)
router.delete("/carts/removeitems",auth,user_controller.remove_cartItems)

module.exports=router