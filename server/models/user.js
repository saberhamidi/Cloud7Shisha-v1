const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const userSchema = mongoose.Schema({
    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type:String
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
    
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email,callback){
    const query = {email: email};
    User.findOne(query, callback);
}

// module.exports.getUserById = function(id,callback){
//     const query = {_id: id};
//     User.findOne(query, callback);
// }

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if (err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            });
        });
}

module.exports.updateUser = function(newData, user_id, callback){
    //update user specified by id
    if (Object.keys(newData)[0] === "password") {
       bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newData.password, salt, function(err, hash){
                if (err) throw err;
                newData.password = hash;
                User.update({_id: user_id}, {$set: newData}, callback);
            });
        });
    }
    else{
        User.update({_id: user_id}, {$set: newData}, callback);
    }
}

module.exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch){
        if (err) throw err;
        callback(null,isMatch);
    })
}