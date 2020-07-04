const express = require('express');
const { body } = require('express-validator');
const productController = require('../Controllers/product');

const Router = express.Router();

//Get all products
Router.get('/get-products', productController.getProducts);

//Create a new product
Router.post('/create-product', [
    body('name').trim().notEmpty().withMessage('Please enter product name'),
    body('description').notEmpty().withMessage('Please enter product description'),
    body('price').notEmpty().withMessage("Product must have a price"),
    body('category').notEmpty().withMessage("Product must lie under a category"),
    body('is_available').notEmpty().withMessage("Product must have an available status")
], productController.createProduct);


//Update specific product
Router.get('/get-specific-product/:id', productController.getSpecificProduct);

//Update specific product
Router.put('/update-product/:id', [
    body('name').trim().notEmpty().withMessage('Please enter product name'),
    body('description').notEmpty().withMessage('Please enter product description'),
    body('price').notEmpty().withMessage("Product must have a price"),
    body('category').notEmpty().withMessage("Product must lie under a category"),
    body('is_available').notEmpty().withMessage("Product must have an available status")
], productController.updateProduct);

//Delete specific product
Router.delete('/delete-product/:id', productController.deleteProduct);

module.exports = Router;