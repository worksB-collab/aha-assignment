const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const authRouter = require('./src/routes/authRoutes');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

const directPage = (page) => {
  return (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sites', page));
  };
}

app.get('/signin', directPage('signin.html'));
app.get('/signup', directPage('signup.html'));
app.get('/profile', (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.redirect('/signin');
    }
    jwt.verify(token, process.env.JWT_SECRET);
    // If authentication succeeds, serve the dashboard HTML
    return directPage(`profile.html`)(req, res, next);
  } catch (error) {
    // If authentication fails, redirect to sign-in page
    return res.redirect('/signin');
  }
});
app.get('/dashboard', (req, res, next) => {
  try {
    const {token, email} = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
      // If authentication succeeds, serve the dashboard HTML
      return directPage(`verifiedDashboard.html`)(req, res, next);
    } else if (!token && email) {
      return directPage(`unverifiedDashboard.html`)(req, res, next);
    } else {
      return res.redirect('/signin');
    }
  } catch (error) {
    // If authentication fails, redirect to sign-in page
    return res.redirect('/signin');
  }
});

app.use(async (req, res, next) => {
  //todo put logic in authController
  try {
    const token = req.cookies.token; // Assuming you're using a library like cookie-parser
    if (!token) {
      return res.redirect('/signin');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // todo get user
    req.user = decoded; // Or fetch user details from the database using decoded.userId
    return res.redirect('/dashboard');
  } catch (error) {
    return res.redirect('/signin');
  }
});

//
// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API endpoints',
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
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
