const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customers');

//Handle GET request for New Order
exports.Orders_get_order = (req, res, next) => {
    res.render("newOrder",{customerId:req.params.customerId});
    res.status(200);
}

//Handle POST request for New Order
exports.Orders_post_order = (req, res, next) => {
    //Create New Order
    const order = new Order({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        customerId: req.params.customerId,
        pricePerKg: req.body.pricePerKg,
        quantityOfEachBox: req.body.quantityOfEachBox,
        NumberOfBox: req.body.NumberOfBox,
        Description: req.body.Description
    });
    //Save the data to DataBase, i.e., to MongoDB
    order.save()
    .then(result => {
        //Increment the Total Amount for the Customer by the Amount of new Order
        Customer.update({_id:result.customerId},{
            $inc : {
                //Amount for the new Order = ( ( Price per Kg ) * ( Quantity of each Box [in Kg] ) * ( Number of Boxes ) )
                totalAmount :  ( result.pricePerKg * result.quantityOfEachBox * result.NumberOfBox/1000 )
            }
        })
        .exec()
        //Redirect to Customer Orders Page if Order Creation Successful
        res.redirect('/../customers/'+result.customerId);  
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Order creation Unsuccessful
        res.redirect("/customers/"+req.params.customerId);
        res.status(500);
    });
}

//Handle Delete Request of an Order
exports.delete_order = (req, res, next) => {
    const id = req.params.pid;
    //Remove Order by ID
    Order.remove({_id:id})
    .exec()
    .then(result => {       
        //Decrement the Total Amount for the Customer by the Amount of the deleted Order
        Customer.update({_id:req.query.userId},{
            $inc : {
                totalAmount :  -(req.query.price)
            }
        })
        .exec();
        //Redirect to Customer Orders Page if Deletion Successful
        res.redirect('/customers/'+req.query.userId);
        res.status(200);
    })
    .catch(err => {
        //Redirect to Customer Orders Page if Deletion unsuccessful
        res.redirect('/customers/'+req.query.userId);
        res.status(500);
    });
}