const mongoose = require('mongoose');
const Customer = require('../models/customers');
const Order = require('../models/order');

//Handle GET Request to Show Customers list
exports.Customers_get_all_customers = (req, res, next) => {
    //get all Customers from DataBase
    Customer.find()
    .exec()
    .then(docs => {
        //Store details of All Customers in the list 'response'
        const response = {
            customers: docs.map(doc => {
                return [
                    doc.id,
                    doc.name,
                    doc.address,
                    doc.orderDelivered,
                    doc.totalAmount,
                    doc.amountPaid,
                ];
            })
        };
        res.render("allCustomers",{data:response.customers});
        res.status(200);
    })
    .catch(err => {
        res.status(500);
    });
}

//Handle GET request to Show Orders of a Customer
exports.Customers_get_customer = (req, res, next) => {
    const id = req.params.oid;
    //find the Customer by id
    Customer.findById(id)
    .exec()
    .then(doc => {
        //if any Customer is found
        if(doc){
            //Store Details of Customer in 'customer' variable
            const customer = [
                doc.id,
                doc.name,
                doc.address,
                doc.orderDelivered,
                doc.totalAmount,
                doc.amountPaid,
                doc.phone,
            ];
            //find all Products ordered by the Customer
            Order.find({customerId: id})
            .exec()
            .then(docs => {
                //Store Orders details in the list 'orderslist'
                const orderslist = {
                    orders: docs.map(doc => {
                        return [
                            doc._id,
                            doc.name,
                            doc.customerId,
                            doc.pricePerKg,
                            doc.quantityOfEachBox,
                            doc.NumberOfBox,
                            doc.Description,
                        ];
                    })
                };
                //Display the Details using HTML
                res.render("singleCustomerDetails",{Odata:customer,Pdata:orderslist.orders});
                res.status(200);
            })
            .catch(err =>{
                //Redirect to Customers list Page if Error Occured in Retrieving Orders
                res.redirect("/customers");
                res.status(500);
            });
        } else {
            //If any Customer is not found, then
            //Redirect to Customers list Page
            res.redirect("/customers");
            res.status(200);
        }
    })
    .catch(err =>{
        //Redirect to Customers list Page if Error Occured in Retrieving Customer
        res.redirect("/customers");
        res.status(500);
    });
}

//Handle GET Request to Show OverAll Statistics of the Sales
exports.Customers_get_all_details = (req, res, next) => {
    //Get all Customers from DataBase
    Customer.find()
    .exec()
    .then(allCustomers => {
        //if any Customer is found
        if(allCustomers){
            //initialize following variable
            var overAll = {};
            overAll.TotalAmount = 0;
            overAll.AmountPaid = 0;
            //Add all Amounts and store in above vars
            allCustomers.forEach(element => {
                overAll.TotalAmount += element.totalAmount;
                overAll.AmountPaid += element.amountPaid;
            });

            //fin all the Products Ordered
            Order.find()
            .exec()
            .then(allOrders => {
                overAll.ProductSales = {};
                //Calculate Total quantities of each Product ordered by overAll Customers
                allOrders.forEach(element =>{
                    if(overAll.ProductSales[element.name]){
                        //Quantity of each item = ( ( Quantity of Each Box [in Kg] ) * ( Number of Boxes ) )
                        overAll.ProductSales[element.name] += element.quantityOfEachBox*element.NumberOfBox/1000;
                    } else {
                        overAll.ProductSales[element.name] = element.quantityOfEachBox*element.NumberOfBox/1000;  
                    };
                });
                //Display the Details using HTML
                res.render("overAllDetails",{data:overAll});
                res.status(200);
            })
            .catch(err =>{
                //Redirect to Customers list Page if Error Occured in Retrieving Products
                res.redirect("/customers");
                res.status(500);
            });
        } else {
            //If any Customer is not found, then
            //Redirect to Customers list Page
            res.redirect("/customers");
            res.status(200);
        }
    })
    .catch(err =>{
        //Redirect to Customers list Page if Error Occured in Retrieving Customer
        res.redirect("/customers");
        res.status(500);
    });
}

//Handle GET Request for New Customer
exports.Customers_get_new_customer = (req, res, next) => {
    res.render("newCustomer");
    res.status(200);
}

//Handle POST Request for New Customer
exports.Customers_post_new_customer = (req, res, next) => {
    //Create new Customer
    const customer = new Customer({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        totalAmount: req.body.totalAmount,
        amountPaid: req.body.amountPaid,
        orderDelivered: req.body.orderDelivered,
        phone: req.body.phone,
    });
    //Save the data to DataBase, i.e., to MongoDB
    customer.save()
    .then(result => {
        //Redirect to Customer Orders Page if Customer Creation Successful
        res.redirect(result._id);
        res.status(200);
    })
    .catch(err => {
        //Stay on Same Page if any Error Occurred
        res.render("newCustomer");
        res.status(500);
    });
}
//Handle Request for EDIT Name of the Customer
exports.edit_customer_details_name = (req, res, next) => {
    const id = req.params.oid;
    //Update Details
    Customer.update({_id:id},{
        $set: {
            name: req.body.name
        }
    })
    .exec()
    .then(result => {
        //Redirect to Customer Orders Page if Updation Successful
        res.redirect('/customers/'+id);  
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Customer Updation Unsuccessful
        res.redirect('/customers/'+id);  
        res.status(500);
    });
}

//Handle Request for EDIT Address of the Customer
exports.edit_customer_details_address = (req, res, next) => {
    const id = req.params.oid;
    //Update Details
    Customer.update({_id:id},{
        $set: {
            address: req.body.address
        }
    })
    .exec()
    .then(result => {
        //Redirect to Customer Orders Page if Updation Successful
        res.redirect('/customers/'+id);  
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Customer Updation Unsuccessful
        res.redirect('/customers/'+id);  
        res.status(500);
    });
}

//Handle Request for EDIT Phone Number of the Customer
exports.edit_customer_details_phone = (req, res, next) => {
    const id = req.params.oid;
    //Update Details
    Customer.update({_id:id},{
        $set: {
            phone: req.body.phone
        }
    })
    .exec()
    .then(result => {
        //Redirect to Customer Orders Page if Updation Successful
        res.redirect('/customers/'+id);  
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Customer Updation Unsuccessful
        res.redirect('/customers/'+id);  
        res.status(500);
    });
}

//Handle Request for EDIT OrderDelivery Status of the Customer
exports.edit_customer_details_orderDelivered = (req, res, next) => {
    const id = req.params.oid;
    //Update Details
    Customer.update({_id:id},{
        $set: {
            orderDelivered: req.body.orderDelivered
        }
    })
    .exec()
    .then(result => {
        //Redirect to Customer Orders Page if Updation Successful
        res.redirect("/customers/"+id);
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Customer Updation Unsuccessful
        res.redirect('/customers/'+id);  
        res.status(500);
    });
}

//Handle Request for EDIT Amount Paid by the Customer
exports.edit_customer_details_amountPaid = (req, res, next) => {
    const id = req.params.oid;
    //Update Details
    Customer.update({_id:id},{
        $inc:{
            amountPaid: req.body.amountPaid,
        }
    })
    .exec()
    .then(result => {
        //Redirect to Customer Orders Page if Updation Successful
        res.redirect('/customers/'+id);  
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Customer Updation Unsuccessful
        res.redirect('/customers/'+id);  
        res.status(500);
    });
}
//Handle Delete Request for Customer
exports.delete_customer = (req, res, next) => {
    const id = req.params.oid;
    //Remove all Orders ordered by the Customer
    Order.remove({customerId:id})
    .exec()
    .then(result => {
        //Delete the Customer Details
        Customer.remove({_id:id})
        .exec()
        .then(result => {
            //Redirect to Customers list Page if Deletion Successful
            res.redirect('/customers');
            res.status(200);
        })
    })
    .catch(err => {
        //Redirect to Customers list Page if Deletion Successful
        res.redirect('/customers');
        res.status(500);
    });
}