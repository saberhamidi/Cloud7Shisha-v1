const express = require('express');
const router =  express.Router();
const User = require('../models/user');
const passport = require('passport');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const email   = require("emailjs/email");
const emailTemplate = require("../emails/emailService");
var moment = require('moment');
moment.locale("en-gb");
const server  = email.server.connect({
   user:    "cloud7shisha@outlook.com", 
   password:"afghanis123", 
   host:    "smtp-mail.outlook.com", 
   tls: {ciphers: "SSLv3"}
});

//register
router.post('/register', function(req, res, next){
	let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile
        });
        
        User.addUser(newUser, function(err, user){
            if (err) {
                res.json({success: false, msg: "User registeration failed"+err});
            }
            else{
                res.json({user: user, success: true, msg: "User Successfuly registered"});
            }
        });
});

//update profile
router.put('/updateProfile/:user_id', passport.authenticate('jwt', { session: false}), function(req, res, next){
    User.updateUser(req.body, req.params.user_id, function(err, user){
        if (err) {
            res.json({success: false, msg: "User failed to update"+err});
        }
        else{
            res.json({user: user, success: true, msg: "User successfuly updated"});
        }
    });
});

router.get('/find/:email', function(req, res, next){
    const lookForuser = User.getUserByEmail(req.params.email, function(err, user){
        if(err){
            res.json({user: user, success: false, msg: "Server connection failed try registering again"});
        }
        else if(user !== null){
            return res.json({user: user, success: false, msg: "There is already an account assouciated with this email"});
        }

        else{
            return res.json({user: user, success: true, msg: "accepting registeration"});
        }
    });

});

router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next){
    const lookForuser = User.getUserById(req.params.id, function(err, user){
        if(err){
            res.json({success: false, msg: "Server connection failed try feching the user again"});
        }
        else if(user){
            return res.json({user: user, success: true, msg: "User found!"});
        }

        else{
            return res.json({success: false, msg: "User doese not exist"});
        }
    });

});

//Authenticate user
router.post('/authenticate', function(req, res, next){
	const email = req.body.email;
    const passport = req.body.password;
    User.getUserByEmail(email, function(err, user){
            if (err) throw err;
            if (!user) {
               return res.json({success: false, msg: "This email is not assouciated with an account, please register first!"});
            }
            User.comparePassword(passport, user.password, function(err, isMatch){
                    if (err) throw err;
                    if (isMatch) {
                        const token = jwt.sign(user.toJSON(), config.secret,{expiresIn: 604000});
                        return res.json({
                            success: true,
                            token: 'JWT '+token,
                            user:{
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                mobile: user.mobile
                            }
                        });
                        
                    }
                    
                    else{
                        
                        return res.json({success: false, msg: 'Wrong password!'});
                    }
                });
        });   
});

//send order confirmation email to the user
router.post('/orderConfirmationEmail', passport.authenticate('jwt', { session: false}), function(req, res, next){
    req.body.date = moment(req.body.date);

    //send confirmation email to customer
    emailTemplate.orderConf().render(req.body, function(err, email){
        if(err){
            return res.json({success: false, msg: "Email template failed to compile!"})
        }
        else{
            const message  = {
                 from:  "Cloud7Shisha<cloud7shisha@outlook.com>", 
                 to:    req.body.customer.email,
                 subject:  "Order confirmation: "+req.body.orderNumber,
                 attachment: 
                   [
                      {data: email.html, alternative:true}
                   ]
            };
            //send the message and get a callback with an error or details of the message that was sent
            server.send(message, function(err, message){
                if(err){return res.json({success: false, msg: "Email failed to sent!"})}
                else{return res.json({success: true, msg: "Email sent successfuly!"})}
            });
        }
    });

    sendOrderConfirmationToUs(req.body);

});

//send confirmation email to cloud7shisa
function sendOrderConfirmationToUs(order){
    emailTemplate.orderConfToUs().render(order, function(err, email, res){
        if(err){
            // return res.json({success: false, msg: "Email template failed to compile!"})
            console.log("emailed failed to compile");
        }
        else{
            const message  = {
                 from:  "Cloud7Shisha<cloud7shisha@outlook.com>", 
                 to:    order.customer.email,
                 subject:  "Order confirmation: "+order.orderNumber,
                 attachment: 
                   [
                      {data: email.html, alternative:true}
                   ]
            };
            //send the message and get a callback with an error or details of the message that was sent
            server.send(message, function(err, message){
                  if(err){
                    //return res.json({success: false, msg: "Email failed to sent!"})
                    console.log("emailed failed to sent!");
                }
                 else{
                    console.log("emailed sent!");
                    //return res.json({success: true, msg: "Email sent successfuly!"})
                }
            });
        }
    });
}

router.post("/welcomeEmail", passport.authenticate('jwt', { session: false}), function(req, res, next){
    emailTemplate.welcomeEmail().render(req.body, function(err, email){
        if(err){
            return res.json({success: false, msg: "Email template failed to compile!"})
        }
        else{
            const message  = {
                 from:  "Cloud7Shisha<cloud7shisha@outlook.com>", 
                 to:    req.body.email,
                 subject:  "Welcome",
                 attachment: 
                   [
                      {data: email.html, alternative:true}
                   ]
            };
            server.send(message, function(err, message){
                if(err){return res.json({success: false, msg: "Email failed to sent!"})}
                else{return res.json({success: true, msg: "Email sent successfuly!"})}
            })
        }
    })
});

module.exports = router;