const express=require("express")
const cart_controller=require("../controllers/order_controller")
const auth=require("../middleware/authUser.js")

const router=new express.Router()

router.post("/placeorder",auth,cart_controller.place_order)
router.get("/orders",cart_controller.get_allOrders)
router.get("/me/orders",auth,cart_controller.get_orders)
router.get("/order/:id",auth,cart_controller.get_order)
router.delete("/order/:id",auth,cart_controller.delete_order)

module.exports=router