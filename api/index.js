require('dotenv').config();

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

const corsOptions = {
  origin: process.env.SERVER_URL,
};
app.use(cors(corsOptions));

app.use(session({
  secret: 'aha',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
require('../src/configs/passport-setup');

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

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css';
const swaggerDocument = require('../src/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL,
}));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
