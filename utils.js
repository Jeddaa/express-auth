const nodemailer = require('nodemailer');

const sendEmail =async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html
  })
}
module.exports = sendEmail;
