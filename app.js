var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
var expressValidator  = require('express-validator');//req.checkbody()
const mongoConfig = require('./configs/mongo-config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const formData = require('express-form-data')
const cloudinary = require('cloudinary')


//replace <username> and <password> with your mongoDB atlas accounts info
//mongoConfig = mongodb://heroku_8bd94qrf:irstf0rv1ds970eebtislm0apf@ds029638.mlab.com:29638/heroku_8bd94qrf
//mongoose.connect(mongoConfig, { useNewUrlParser: true, useCreateIndex: true, },function(error){

mongoose.connect(`mongodb://localhost:27017/AuroraShop`, { useNewUrlParser: true, useCreateIndex: true, },function(error){
  if(error) throw error
    console.log(`connect mongodb success`);
});

var app = express()
app.use(cors())
//require('./seed');  // kkj-initialize mongodb (only one at first starting)

app.use('/.netlify/functions/app', indexRouter);  // path must route to lambda
app.use('/.netlify/functions/app', usersRouter);  // path must route to lambda

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root          = namespace.shift(),
    formParam     = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formData.parse())
app.use(cookieParser());

//set static dir
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // console.log(err);
  res.status(err.status || 500).json(err);
});

// cloudinary.config({
//   cloud_name: 'dlfq221tq',
//   api_key: '692167228733453',
//   api_secret: 'F3K7W3ctXyQXTKw0PZCI8ZCESVQ'
// })

//
// app.get('/wake-up', (req, res) => res.send('👌'))
//
// app.post('/image-upload', (req, res) => {
//
//   console.log("lpeeeeeeeeeeeeeeeeeeeeeeee    "  + req)
//   console.log(req.files)
//   console.log("wwwwwwwwwwwwwwwwwwwwww    "  + req.files)
//   const values = Object.values(req.files)
//   const promises = values.map(image => cloudinary.uploader.upload(image.path))
//
//   Promise
//       .all(promises)
//       .then(results => {
//             res.json(results)
//             console.log(results)
//           }
//       )
//       .catch((err) => res.status(400).json(err))
// })

module.exports = app;
