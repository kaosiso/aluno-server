require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const sender =  process.env.SENDER
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
  sgMail,
  sender,
};
