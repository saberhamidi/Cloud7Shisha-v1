const express = require('express');
const router =  express.Router();
const order = require('../models/order');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//add order
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next){
	let myOrder = new order(req.body);
    order.addOrder(myOrder, function(err, newOrder){
        if (err) {
            res.json({success: false, msg: "Order failed to gets added."+err});
        }
        else{
            res.json({order: newOrder, success: true, msg: "Order Successfuly recieved"});
        }
    });
});

//fetch order by id
router.get('/:order_id',passport.authenticate('jwt', { session: false}),function(req, res, next){
    const fetchorder = order.getOrder(req.params.order_id, function(err, order){
        if(err){
            res.json({order: null, success: false, msg: "Server failed to fetch order"});
        }
        else if(order){
            return res.json({order: order, success: true, msg: "Order successfuly fetched"});
        }
        else{
            return res.json({order: null, success: false, msg: "Could not find the order"});
        }
    });
});

//fetch order by user id
router.get('/user/:user_id', passport.authenticate('jwt', { session: false}), function(req, res, next){
    const fetchorder = order.getOrderByUserId(req.params.user_id, function(err, orders){
        if(err){
            res.json({orders: null, success: false, msg: "Server failed to fetch orders"});
        }
        else if(orders.length>0){
            return res.json({orders: orders, success: true, msg: "Orders successfuly fetched"});
        }
        else{
            return res.json({orders: null, success: false, msg: "could not find any orders"});
        }
    });
});

//update order
router.put('/:order_id', passport.authenticate('jwt', { session: false}), function(req, res, next){
	order.updateOrder(req.body, req.params.order_id, function(err, order){
	    if (err) {
            res.json({success: false, msg: "order failed to update"+err});
        }
        else{
            res.json({order: order, success: true, msg: "order successfuly updated"});
        }
	});
});
module.exports = router;