const mongoose = require('mongoose');
const config = require('../config/database');

//order Schema
const orderSchema = mongoose.Schema({
	orderNumber:{
		type: String,
		require: true,
	},
	date:{
		type: Date,
		require: true
	},
	deliveryTime: {
		type: String,
		require: true
	},
	customer:{
		type: Object,
		require: true
	},
	basket:{
		type: Array,
		require: true,
	},
	deliveryAddress:{
		type: Object,
		require: true
	},
	bill:{
		type: Object,
		require: true
	},
	comment: {
		type: String
	}
});

const order = module.exports = mongoose.model('order', orderSchema);


module.exports.getOrder = function(id,callback){
    const query = {_id: id};
    order.findOne(query, callback);
}

module.exports.getOrderByUserId = function(user_id, callback){
    const query = {"customer.id": user_id};
    order.find(query, callback).sort({date: -1});
}

module.exports.addOrder = function(order, callback){
    order.save(callback);
}

module.exports.updateOrder = function(order,order_id, callback){
	const query = {_id: order_id};
    order.update(query, {order: order}, callback);
}