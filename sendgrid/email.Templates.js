// template.js

function verificationEmailTemplate(userName, verificationLink) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aluno Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f9fc;
      color: #333;
      margin: 0; padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #007bff;
    }
    a {
      background-color: #007bff;
      color: white;
      padding: 12px 24px;
      border-radius: 5px;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
    }
    a:hover {
      background-color: #0056b3;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification</h1>
    <p>Hi ${userName},</p>
    <p>Thanks for registering with Aluno! Please verify your email address by clicking the button below:</p>
    <a href="${verificationLink}" target="_blank" rel="noopener noreferrer">Verify Email</a>
    <p>If you did not create an account, you can safely ignore this email.</p>
    <p>Thanks,<br/>The Aluno Team</p>
    <div class="footer">
      <p>If you have any questions, reply to this email or visit our support page.</p>
    </div>
  </div>
</body>
</html>
`;
}

const passwordResetSuccessTemplate = (userName, loginURL) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aluno Password Reset Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f9fc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    a.button {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background-color: #007bff;
      color: white !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    a.button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Successful</h1>
    <p>Hi ${userName},</p>
    <p>Your password has been successfully reset. You can now log in to your Aluno account using your new password.</p>
    <p>If you did not perform this action, please contact our support team immediately.</p>
    <p><a href="${loginURL}" class="button">Log In to Your Account</a></p>
    <p>Thanks,<br/>The Aluno Team</p>
    <div class="footer">
      <p>If you have any questions, reply to this email or visit our support page.</p>
    </div>
  </div>
</body>
</html>
`;
};

function passwordResetTemplate(email, resetURL) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Aluno Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f9fc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    a.button {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background-color: #007bff;
      color: white !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    a.button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Aluno Password Reset Request</h1>
    <p>Hi ${email},</p>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <p><a href="${resetURL}" class="button">Reset Your Password</a></p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Thanks,<br/>The Aluno Team</p>
    <div class="footer">
      <p>If you have any questions, reply to this email or contact our support team.</p>
    </div>
  </div>
</body>
</html>
`;
}

// Export all templates together
module.exports = {
  verificationEmailTemplate,
  passwordResetSuccessTemplate,
  passwordResetTemplate,
};
