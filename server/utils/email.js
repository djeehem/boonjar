import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = (user, token) => {
  const mailOptions = {
    from: "Your Name <your.email@gmail.com>",
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>Hello ${user.name},</p>
      <p>We received a request to reset your password. Please click the link below to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(
        `Password reset email sent to ${user.email}: ${info.response}`
      );
    }
  });
};

export { sendPasswordResetEmail };
