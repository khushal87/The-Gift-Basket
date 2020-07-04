const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Product = require('../Models/product');

function clearFile(pathname) {
    fs.unlink(pathname, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("Successfully deleted the file.")
        }
    })
}

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then((products) => {
            res.status(200).json({ message: "Products fetched", products: products });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createProduct = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed,entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const image = req.file.path;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const discount = req.body.discount;
    const category = req.body.category;
    const relationship = req.body.relationship;
    const occasion = req.body.occasion;
    const is_available = req.body.is_available;


    const product = new Product({
        name: name,
        description: description,
        price: price,
        image: image,
        category: category,
        relationship: relationship,
        occasion: occasion,
        is_available: is_available,
        discount: discount,
    })

    product.save()
        .then((result) => {
            res.status(200).json({ message: "Product Created Successfully", product: product });
        }).catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getSpecificProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.status = 404;
                throw error;
            }
            res.status(200).json({ message: 'Product Fetched!', product: product });
        }).catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateProduct = (req, res, next) => {
    const productId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed,entered data is incorrect.');
        error.statusCode = 422;
        throw error;
        // return res.status(422).json({ message: 'Validation failed,entered data is incorrect.', errors: errors.array() });
    }
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const discount = req.body.discount;
    const category = req.body.category;
    const relationship = req.body.relationship;
    const occasion = req.body.occasion;
    const is_available = req.body.is_available;
    let image = req.body.image;

    if (req.file) {
        image = req.file.path;
    }
    if (!image) {
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.status = 404;
                throw error;
            }
            if (image !== product.image) {
                clearFile(product.image);
            }
            product.name = name;
            product.description = description;
            product.price = price;
            product.category = category;
            product.occasion = occasion;
            product.relationship = relationship;
            product.discount = discount;
            product.is_available = is_available;
            product.image = image;
            return product.save();
        })
        .then((result) => {
            res.status(200).send({ message: "Product updated successfully!", product: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.status = 404;
                throw error;
            }
            clearFile(product.image)
            return Product.findByIdAndRemove(productId);
        })
        .then(result => {
            res.status(200).json({ message: "Deleted post successfully!" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}