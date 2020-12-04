const nodemailer = require("nodemailer");
const config = require("./config");

const sendEmail = async ({ to, subject, html, from = config.EMAIL_FROM }) => {
  try {
    const transporter = nodemailer.createTransport(config.SMTP_OPTIONS);
    await transporter.sendMail({ from, to, subject, html });
  } catch (error) {
    throw "Failed to send request, please check address and try again.";
  }
};

const sendVerificationEmail = async (verificationToken, email) => {
  const verifyUrl = `${config.BASE_URL}/auth/verifyemail/${verificationToken}`;
  const message = `<p>Please click the below link to verify your email address:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;

  await sendEmail({
    to: email,
    subject: "Verification API - Verify Email",
    html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`,
  });
};

const sendPasswordResetEmail = async (passwordResetToken, email) => {
  const resetUrl = `${config.BASE_URL}/auth/resetpassword/${passwordResetToken}`;
  const message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  await sendEmail({
    to: email,
    subject: "Verification API - Reset Password",
    html: `<h4>Reset Password Email</h4>
              ${message}`,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
