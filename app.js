const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const createError = require('http-errors');
const multer = require('multer');

//App Routes
const productRoutes = require('./Routes/product');

//App initialization
const app = express();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


//App utilities
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({ extended: false }));    //x-www-form-urlencoded
app.use(bodyParser.json());         //application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'Images')));

//To set cors header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})


app.use('/products', productRoutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});




//Handling error and response
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})


//Mongoose connection
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then((result) => {
        app.listen(8000);
    }).then((res) => {
        console.log("hey");
    }).catch(error => {
        console.log(error);
    })

