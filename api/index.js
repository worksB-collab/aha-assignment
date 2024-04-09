require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const authRouter = require('../src/routes/authRoutes');
const app = express();
const session = require('cookie-session');
const passport = require("passport");
const cors = require('cors');

app.use(session({
  secret: 'aha',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
require('../src/config/passport-setup');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', authRouter);

const directPage = (page) => {
  return (req, res) => {
    res.sendFile(path.join(__dirname, '../public/sites', page));
  };
}

app.get('/signin', directPage('signin.html'));
app.get('/signup', directPage('signup.html'));
app.get('/dashboard', (req, res, next) => {
  try {
    const {token, email} = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
      return directPage(`verifiedDashboard.html`)(req, res, next);
    } else if (!token && email) {
      return directPage(`unverifiedDashboard.html`)(req, res, next);
    } else {
      return res.redirect('/signin');
    }
  } catch (error) {
    console.log('dashboard error', error);
    return res.redirect('/signin');
  }
});

app.get('/dashboard/google', (req, res, next) => {
  try {
    const {token} = req.session.passport.user;
    jwt.verify(token, process.env.JWT_SECRET);
    return directPage(`verifiedDashboard.html`)(req, res, next);
  } catch (error) {
    console.log('dashboard google error', error);
    return res.redirect('/signin');
  }
});

const swaggerDocument = require('../src/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/signin');
    }
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/dashboard');
  } catch (error) {
    return res.redirect('/signin');
  }
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
