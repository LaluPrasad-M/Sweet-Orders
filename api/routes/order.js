const express = require('express');
const router = express.Router();
const OrderController = require("../controllers/order");

//Show Add-New-Customer Form
router.get("/:customerId",OrderController.Orders_get_order);

//Create new Order
router.post("/:customerId",OrderController.Orders_post_order);

//Delete an Order
router.post("/delete/:pid",OrderController.delete_order);

module.exports = router;