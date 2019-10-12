const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//address Schema
const addressSchema = mongoose.Schema({
    
    userId:{
        type: String,
        required: true
    },
    streetNumber:{
        type: String,
        required: true
    },
    streetName:{
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    }
});

const Address = module.exports = mongoose.model('Address', addressSchema);

module.exports.addAddress = function(newAddress, callback){
    newAddress.save(callback);
}

module.exports.getAddressesByUserId = function(userId,callback){
    const query = {userId: userId};
    Address.find(query, callback);
}

module.exports.removeAddress = function(address_id, callback){
    const query = {_id: address_id};
    Address.deleteOne(query, callback);
}
