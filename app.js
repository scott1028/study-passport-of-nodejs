var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// passport stratege
// ref: http://www.passportjs.org/docs/configure/
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('[LocalStrategy]', [ username, password ]);
    return done(null, { id: 1 });

    // ## If you have another strategy logic to authenticate user
    // ## You substitute ORM for Dummy-User
    //
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));

// ref: http://www.passportjs.org/docs/authenticate/#sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, { id });

  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

// for passport
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// for passport
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // ref: http://www.passportjs.org/docs/authenticate/#sessions
  console.log([ req.user ]);

  if(!req.user && !req.path.startsWith('/login')) {
    console.log('User not login!!');
    return res.redirect('/login/do');
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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
