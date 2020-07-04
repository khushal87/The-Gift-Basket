const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
    },
    occasion: {
        type: String,
    },
    is_available: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);