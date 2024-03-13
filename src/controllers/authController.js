const authService = require('../services/authService');
const userService = require('../services/userService');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const signUp = async (req, res) => {
  try {
    const {name, email, password, repeatedPassword} = req.body;
    // Use Auth0 service to create a user.js
    await authService.signUp(name, email, password, repeatedPassword);
    res.cookie('email', email, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};

const verifyEmail = async (req, res) => {
  const {token} = req.query;
  const user = await authService.verifyToken(token);
  if (user) {
    const jwtToken = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', jwtToken, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard'); // Redirect user to the dashboard
  } else {
    res.status(404).send('Token not found or expired');
  }
}

const resendEmail = async (req, res) => {
  try {
    const {email} = req.query;
    await authService.resendVerificationEmail(email);
    res.status(201).send('Email sent');
  } catch (error) {
    res.status(404).send('Account not found or expired');
  }
}

const signIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    await authService.signIn(email, password);
    const jwtToken = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', jwtToken, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.cookie('email', email, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};

const googleSignIn = () => {
  passport.authenticate('google', {scope: ['profile', 'email']});
}

const googleCallback = () => {
  passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
}

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, // Match the settings from when you set the cookie
    sameSite: 'strict',
  });
  res.redirect('/signin');
}

const getProfile = async (req, res) => {
  try {
    authenticate(req);
    const {email} = req.query;
    const user = await userService.findUserByEmail(email);
    res.status(200).send({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const updateUsername = async (req, res) => {
  try {
    authenticate(req);
    const {email, newName} = req.body;
    const user = await userService.findUserByEmail(email);
    user.name = newName;
    await userService.save(user);
    res.status(200).send({});
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const authenticate = (req) => {
  const auth = req.headers.authorization;
  const token = auth ? auth.split('Bearer ')[1] : null;
  jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
  signUp, verifyEmail, resendEmail, signIn, googleSignIn, googleCallback, logout, getProfile, updateUsername
}