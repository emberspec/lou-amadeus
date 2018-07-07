const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const request      = require('request');
const LocalStorage = require('node-localstorage').LocalStorage;



localStorage       = new LocalStorage('./scratch');

const indexRouter    = require('./routes/index');
const adminRouter    = require('./routes/admin');
const managerRouter  = require('./routes/manager');
const encoderRouter  = require('./routes/encoder');

const amadeusRouter  = require('./routes/amadeus');

const app            = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);
app.use('/encoder', encoderRouter);

app.use('/amadeus', amadeusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//const port       = 8080;
const port       = 80;

app.listen(port, () => {
	//console.log("Link starto at 8080");
	console.log("Link start at 8080");
})



module.exports = app;
