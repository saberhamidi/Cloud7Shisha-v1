const express = require('express');
const router =  express.Router();
const Basket = require('../models/basket');

//add basket
router.post('/addItem', function(req, res, next){
	let basket = new Basket({
		items: [],
        subtotal: 0,
		audit:{
			createDate: new Date()
		}
	});
    Basket.addItem(basket, function(err, basket){
        if (err) {
            res.json({success: false, msg: "Item failed to add"+err});
        }
        else{
            res.json({basket: basket, success: true, msg: "Item Successfuly added"});
        }
    });
});

//fetch basket
router.get('/fetchBasket/:basket_id', function(req, res, next){
    const fetchBasket = Basket.getBasket(req.params.basket_id, function(err, basket){
        if(err){
            res.json({basket: null, success: false, msg: "Server failed to fetch basket"});
        }
        else if(basket){
            return res.json({basket: basket, success: true, msg: "Basket successfuly fetched"});
        }
        else{
            return res.json({basket: null, success: false, msg: "could not find basket"});
        }
    });
});

//update basket
router.put('/updateBasket/:basket_id', function(req, res, next){
	Basket.updateBasket(req.body, req.params.basket_id, function(err, basket){
	    if (err) {
            res.json({success: false, msg: "basket failed to update"+err});
        }
        else{
            res.json({basket: basket, success: true, msg: "Basket successfuly updated"});
        }
	});
});

router.put('/updateDiscount/', function(req, res, next){
    Basket.updateDiscount(req.body, function(err, basket){
        if (err) {
            res.json({success: false, msg: "basket failed to update"+err});
        }
        else{
            res.json({basket: basket, success: true, msg: "Discount applied"});
        }
    });
});
module.exports = router;