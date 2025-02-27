const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sudalaiperumalcoda@gmail.com', 
    pass: 'Sundar@27' 
  }
});

exports.sendMail = functions.https.onCall(async (data, context) => {
  const { to, subject, text } = data;

  // Create an email message
  const mailOptions = {
    from: 'sudalaiperumalcoda@gmail.com',
    to,
    subject,
    text
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
});
