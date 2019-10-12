const mongoose = require('mongoose');
const config = require('../config/database');

//basket Schema
const basketSchema = mongoose.Schema({
	items:{
		type: Array,
		require: true,
	},
	subtotal: {
		type: Number,
		require: true
	},
	discounted:{
		type: Boolean,
		require: true,
		default: false
	},
	discount: {
		type: Number,
		require: true,
		default: 0
	},
	//remove the record after certain time
	audit:{
		createDate:  {type: Date, expires: "5d"}
	}
});

const Basket = module.exports = mongoose.model('Basket', basketSchema);


module.exports.getBasket = function(id,callback){
    const query = {_id: id};
    Basket.findOne(query, callback);
}

module.exports.addItem = function(item, callback){
    item.save(callback);
}

module.exports.updateBasket = function(basket,basket_id, callback){
	const query = {_id: basket_id};
	Basket.update(query, {items: basket.items, subtotal: basket.subtotal, discount: basket.discount}, callback);
}
module.exports.updateDiscount = function(basket, callback){
	const query = {_id: basket._id};
	Basket.update(query, {discount: basket.discount, discounted: basket.discounted}, callback);
}