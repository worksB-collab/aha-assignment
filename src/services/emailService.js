const nodemailer = require('nodemailer');

async function sendVerificationEmail(userEmail, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: 'rybit1211@gmail.com',
    to: userEmail,
    subject: 'Verify Your Email',
    html: `<p>Please verify your email by clicking on the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
  });
}

module.exports = {
  sendVerificationEmail,
};
