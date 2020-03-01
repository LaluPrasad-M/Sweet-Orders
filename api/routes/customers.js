const express = require('express');
const router = express.Router();
const CustomerController = require("../controllers/customers");

//Show Add-New-Customer Form
router.get("/newcustomer",CustomerController.Customers_get_new_customer);

//Create a new Customer
router.post("/newcustomer",CustomerController.Customers_post_new_customer);

//Show OverAll statistics of Sales
router.get("/details",CustomerController.Customers_get_all_details);

//Show a Customer Details by Customer ID
router.get("/:oid",CustomerController.Customers_get_customer);

//Show all Customers List
router.get("/",CustomerController.Customers_get_all_customers);

//Accept new Amount from Customer
router.post("/:oid/EditAmountPaid",CustomerController.edit_customer_details_amountPaid);

//Change Customer Name
router.post("/:oid/name",CustomerController.edit_customer_details_name);

//Change Customer Address
router.post("/:oid/address",CustomerController.edit_customer_details_address);

//Change Customer Phone Number
router.post("/:oid/phone",CustomerController.edit_customer_details_phone);

//Change if Order is delivered or not
router.post("/:oid/orderDelivered",CustomerController.edit_customer_details_orderDelivered);

//Delete Customer details and all his Orders
router.post("/delete/:oid",CustomerController.delete_customer);

module.exports = router;