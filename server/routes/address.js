const express = require('express');
const router =  express.Router();
const Address = require('../models/address');
const config = require('../config/database');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//add to address book
router.post('/', passport.authenticate('jwt', { session: false}),function(req, res, next){
	let newAddress = new Address(req.body);
    Address.addAddress(newAddress, function(err, address){
        if (err) {
            res.json({success: false, msg: "Address failed to get added"+err});
        }
        else{
            res.json({address: address, success: true, msg: "Address Successfuly added to the address book"});
        }
    });
});

//find addresses
router.get('/:userId', passport.authenticate('jwt', { session: false}),function(req, res, next){
    const lookForAddress = Address.getAddressesByUserId(req.params.userId, function(err, addresses){
        if(err){
            res.json({success: false, msg: "Server connection failed try adding the address again"});
        }
        else if(addresses.length >0){
            return res.json({addresses: addresses, success: true, msg: "addresses found in relation to the user."});
        }

        else{
            return res.json({success: false, msg: "No address found"});
        }
    });

});

//Remove address
router.put('/removeAddress/:address_id',function(req, res, next){
    const deleteAddress = Address.removeAddress(req.params.address_id, function(err, respond){
        if(err){
           return res.json({success: false, msg: "Server connection failed delete the address"});
        }

        else{
            return res.json({success: true, msg: "Address deleted"});
        }
    });

});

module.exports = router;