const Joi = require('joi');

//post product validation

const productSchema = Joi.object
({
  productName: Joi.string().min(3).max(30).required(),
  alternateName: Joi.string().min(3).max(30),
  productDescription: Joi.string().min(3).max(50),
  productPrice: Joi.number().positive().precision(2).min(0),
  productImage: Joi.string(),
  productQuantity: Joi.number().integer().positive()
});

//order validation

const productItemSchema = Joi.object
({
  prodId: Joi.number().integer().positive().required(),
  prodQuantity: Joi.number().integer().positive().required(),
});

const orderSchema = Joi.object
({
  customerId: Joi.number().integer().positive().required(),
  products: Joi.array().items(productItemSchema).min(1).required(),
});

//update validation

const updatedProductItemSchema = Joi.object
({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

const updateSchema = Joi.object
({
  orderId: Joi.number().integer().positive().required(),
  updatedProducts: Joi.array().items(updatedProductItemSchema).min(1).required(),
});

const fetchSchema = Joi.object
({
  customerId: Joi.number().integer().positive().required(),
});

module.exports = {productSchema,orderSchema,updateSchema,fetchSchema};