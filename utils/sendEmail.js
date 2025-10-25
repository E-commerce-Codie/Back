// const NodeMailer = require("nodemailer");

// const sendEmails = async (options) => {
//   const transporter = NodeMailer.createTransport({
//     host: process.env.Email_HOST,
//     port: process.env.Email_PORT,
//     secure: process.env.Email_SECURE,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmails;
// normal way for backend real not Vercel or Netlify serverless functions

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmails = async (options) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,  // e.g. "Codie <onboarding@resend.dev>"
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmails;
