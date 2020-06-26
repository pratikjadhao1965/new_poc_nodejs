const express=require("express")
const multer=require("multer")
const item_controller=require("../controllers/item_controller")
const authShop=require("../middleware/authShop.js")

const router=new express.Router()


router.post("/items",item_controller.create_item)
router.get("/allitems",item_controller.get_allItems)
router.get("/items",item_controller.get_items)
router.get("/items/:id",item_controller.get_item)
router.get("/searchitems/:key",item_controller.search_items)
router.get("/searchitems/",item_controller.search_items)
router.patch("/items/:id",item_controller.update_item)
router.delete("/items/:id",item_controller.delete_item)

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

router.post("/items/:id/image",upload.single('image'),item_controller.upload_image)
router.delete("/items/:id/image",item_controller.delete_image)
router.get("/items/:id/image",item_controller.get_image)

module.exports=router