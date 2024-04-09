const authService = require('../services/authService');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const signUp = async (req, res) => {
  try {
    const {name, email, password, repeatedPassword} = req.body;
    await authService.signUp(name, email, password, repeatedPassword);
    res.cookie('email', email, {maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};

const verifyEmail = async (req, res) => {
  const {email, verificationToken} = req.query;
  await authService.verifyToken(verificationToken);
  const jwtToken = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '30d'});
  res.cookie('token', jwtToken, {maxAge: 30 * 24 * 60 * 60 * 1000});
  res.cookie('email', email, {maxAge: 30 * 24 * 60 * 60 * 1000});
  res.redirect('/dashboard');
}

const resendEmail = async (req, res) => {
  try {
    const {email} = req.query;
    await authService.resendVerificationEmail(email);
    res.status(201).send({message: 'Email sent'});
  } catch (error) {
    res.status(404).send({message: 'Account not found or expired'});
  }
}

const signIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    const verified = await authService.signIn(email, password);
    if (!verified) {
      res.cookie('email', email, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
      res.redirect('/dashboard');
      return;
    }
    const jwtToken = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', jwtToken, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.cookie('email', email, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};

const googleSignIn = passport.authenticate('google', {scope: ['profile', 'email']});

const googleCallback = passport.authenticate('google', {failureRedirect: '/signin'});

const onGoogleSignInSuccessful = (req, res) => {
  res.redirect('/dashboard');
}

const redirectGoogleUserToDashboard = (req, res) => {
  const user = req.user;
  res.cookie('token', user.token, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
  res.cookie('email', user.email, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
  res.cookie('googleId', user.googleId, {sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000});
  res.redirect('/dashboard/google');
};

const logout = (req, res) => {
  res.clearCookie('token', {
    sameSite: 'strict',
  });
  res.clearCookie('email', {
    sameSite: 'strict',
  });
  res.clearCookie('googleId', {
    sameSite: 'strict',
  });
  res.redirect('/signin');
}

const getProfile = async (req, res) => {
  const auth = req.headers.authorization;
  const {email} = req.query;
  try {
    const profile = await authService.getProfile(auth, email);
    res.status(200).send(profile);
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const updateUsername = async (req, res) => {
  const auth = req.headers.authorization;
  const {email, newName} = req.body;
  try {
    await authService.updateUsername(auth, email, newName);
    res.status(200).send({});
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const resetPassword = async (req, res) => {
  const auth = req.headers.authorization;
  const {email, oldPassword, newPassword, repeatPassword} = req.body;
  try {
    await authService.resetPassword(auth, email, oldPassword, newPassword, repeatPassword);
    res.status(200).send({});
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const getAllUsers = async (req, res) => {
  const auth = req.headers.authorization;
  try {
    const userList = await authService.getAllUsers(auth);
    res.status(200).send(userList);
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

const getStatistics = async (req, res) => {
  const auth = req.headers.authorization;
  try {
    const statistics = await authService.getStatistics(auth);
    res.status(200).send(statistics);
  } catch (error) {
    res.status(400).send({message: error.message});
  }
}

module.exports = {
  signUp,
  verifyEmail,
  resendEmail,
  signIn,
  googleSignIn,
  onGoogleSignInSuccessful,
  googleCallback,
  logout,
  getProfile,
  updateUsername,
  redirectGoogleUserToDashboard,
  resetPassword,
  getAllUsers,
  getStatistics,
}