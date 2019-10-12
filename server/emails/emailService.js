var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path');
var orderConfirmationTemplate = path.join(__dirname, 'templates', 'orderConfirmation');
var orderConfirmationToUsTemplate = path.join(__dirname, 'templates', 'orderConfirmationToUs');
var welcomeEmailTemplate = path.join(__dirname, 'templates', 'welcomeEmail');
var Rx = require('rxjs');
var Handlebars = require('handlebars');

Handlebars.registerHelper({
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function (v1, v2) {
        return v1 && v2;
    },
    or: function (v1, v2) {
        return v1 || v2;
    },
    dc: function (v){
    	return v.toFixed(2);
    },
    div: function (v1, v2){
    	return v1/v2;
    },
    dt: function (v){
        return v.format("L");
    },
    tm: function (v){
        return v.format("LT");
    },
    dis: function (v){
        return v*-1;
    },
    ttl: function (v1, v2){
        return v1+v2;
    }

});

var orderConfirmation = new EmailTemplate(orderConfirmationTemplate);
var orderConfirmationToUs = new EmailTemplate(orderConfirmationToUsTemplate);
var welcome_email = new EmailTemplate(welcomeEmailTemplate);

module.exports.orderConf = function(){
	return orderConfirmation;
}

module.exports.orderConfToUs = function(){
    return orderConfirmationToUs;
}

module.exports.welcomeEmail = function(){
	return welcome_email;
}