const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./middleware/logger')
const bookRouter = require('./routes/book')
const err404  =require('./middleware/err-404')
const router =  express.Router()
const fileMulter = require('./middleware/file')
const fs = require('fs')
const helmet = require('helmet');



const app = express()
app.use(express.json())
app.use(helmet());
app.use(logger)
app.use(express.urlencoded({extended: true }));
app.use('/api',bookRouter)

app.use('/public',express.static(__dirname+'/public'))

app.set('view engine','ejs')


app.use(err404)
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).send('Something broke!');

});

const PORT = process.env.PORT || 3000
app.listen(PORT)