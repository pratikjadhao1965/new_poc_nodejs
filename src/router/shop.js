const express=require("express")
const multer=require("multer")
const shop_controller=require("../controllers/shop_controller")
const authShop=require("../middleware/authShop.js")

const router=new express.Router()

router.post("/Shops",shop_controller.create_shop)
router.post("/shops/login",shop_controller.login_shop)
router.post("/shops/logoutAll",authShop,shop_controller.logoutAll_shop)
router.post("/shops/logout",authShop,shop_controller.logout_shop)
router.get("/shops/me",authShop,shop_controller.get_shopProfile)
router.get("/shops/:id",shop_controller.get_shopProfile)
router.patch("/shops/me",authShop,shop_controller.update_shopProfile)
router.delete("/shops/me",authShop,shop_controller.delete_shopProfile)

//upload image
const upload=multer({
    limits:{
        fileSize:4000000
    },
    fileFilter(req,file,cd){
        // if(!file.originalname.endsWith(".pdf"))
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            return cd(new Error("please upload image"))
        }
        cd(undefined,true)
    }
})

router.post("/shops/me/avatar",authShop,upload.single('avatar'),shop_controller.upload_avatar)
router.delete("/shops/me/avatar",authShop,shop_controller.delete_avatar)
router.get("/shops/:id/avatar",shop_controller.get_avatar)

module.exports=router