require("dotenv").config(); // <-- Make sure you load .env variables

// email.js
const { sgMail, sender } = require("./emails");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Make sure you set this in your .env file
const {
  verificationEmailTemplate,
  passwordResetTemplate,
  passwordResetSuccessTemplate,
} = require("./email.Templates"); // adjust path and filename

async function sendVerificationEmail(email, userName, verificationLink) {
  const html = verificationEmailTemplate(userName, verificationLink);

  const msg = {
    to: email,
    from: sender,
    subject: "Verify your email",
    html,
    categories: ["Email Verification"],
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Verification email sent:", response);
    return { success: true, response };
  } catch (error) {
    console.error(
      "❌ Error sending verification email:",
      error.response ? error.response.body : error
    );
    return {
      success: false,
      message:
        error?.response?.body?.errors?.[0]?.message ||
        "Failed to send verification email",
    };
  }
}

const sendWelcomeEmail = async (email, name = "") => {
  const msg = {
    to: email,
    from: sender, // Must be verified with SendGrid
    subject: "Welcome to Our Platform!",
    html: `
      <h2>Welcome${name ? `, ${name}` : ""}!</h2>
      <p>Thank you for verifying your email. We're excited to have you on board.</p>
      <p>Explore your dashboard, start your journey, and let us know if you need anything.</p>
      <br/>
      <p>Cheers,<br/>The Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(
      "Error sending welcome email:",
      error.response?.body || error.message
    );
    throw new Error("Failed to send welcome email");
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const msg = {
    to: email,
    from: sender, // Must be verified in your SendGrid account
    subject: "Reset your password",
    html: passwordResetTemplate(email, resetURL),
    category: "Password Reset",
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      error.response?.body || error.message
    );
    throw new Error("Failed to send reset email");
  }
};


/**
 * Send a password reset success email with login link.
 * @param {string} email - Recipient's email.
 * @param {string} userName - Recipient's name.
 * @param {string} loginURL - Optional login URL (defaults to env/client login).
 */
const sendResetSuccessEmail = async (
  email,
  userName,
  loginURL = `${process.env.CLIENT_URL}/login`
) => {
  const msg = {
    to: email,
    from: sender, // Replace with your verified sender
    subject: "Your Password Has Been Reset",
    html: passwordResetSuccessTemplate(userName, loginURL),
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset success email sent to ${email}`);
  } catch (error) {
    console.error(
      "Error sending reset success email:",
      error.response?.body || error
    );
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
