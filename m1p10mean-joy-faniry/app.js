//const { connection } = require("./src/configuration/database");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//connection à la base de donnée
//connection();

var indexRouter = require('./routes/index');
var personnelRouter = require('./routes/personnel');
var serviceRouter = require('./routes/service');
var favorisRouter = require('./routes/preference');
const utilisateurRouter = require('./routes/utilisateur');

var app = express();
/* Connexion */
const {connection} = require("./src/configuration/database");
connection();

const allowedOrigin = ["http://localhost:4200"];
const options = cors.CorsOptions = {
  origin:allowedOrigin
}

app.use(cors(options));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', personnelRouter);
app.use('/', serviceRouter);
app.use('/', favorisRouter);
app.use('/', utilisateurRouter)

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

module.exports = app;
