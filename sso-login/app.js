const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const helmet = require('helmet');

const passport = require('./src/config/passportHandler');

const userRouter = require('./src/router/router');


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: '15mb' }));
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

/* Registering Router */
app.use('/user', userRouter);

app.use('/', (req, res, next) => res.send('hello world'));

// app.use(errorHandler);

module.exports = app;

