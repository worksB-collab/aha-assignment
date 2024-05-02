const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.SERVER_URL}/auth/verify-email?email=${userEmail}&verificationToken=${verificationToken}`;

  await transporter.sendMail({
    from: 'rybit1211@gmail.com',
    to: userEmail,
    subject: 'Verify Your Email',
    html: `<p>Please verify your email by clicking on the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
  });
};

module.exports = {
  sendVerificationEmail,
};
