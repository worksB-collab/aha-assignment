const authService = require('../services/authService');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const signUp = async (req, res) => {
  try {
    const {name, email, password, repeatedPassword} = req.body;
    // Use Auth0 service to create a user.js
    await authService.signUp(name, email, password, repeatedPassword);
    res.status(201).send("please verify your email");
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};

const verifyEmail = async (req, res) => {
  const {token} = req.query;
  const user = await authService.verifyToken(token);
  if (user) {
    const jwtToken = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', jwtToken, {httpOnly: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard'); // Redirect user to the dashboard
  } else {
    res.status(404).send('Token not found or expired');
  }
}

const signIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    await authService.signIn(email, password);
    const jwtToken = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', jwtToken, {httpOnly: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
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

const checkJwt = (jwtToken) => {

}

module.exports = {
  signUp, verifyEmail, signIn, googleSignIn, googleCallback, logout, checkJwt
}