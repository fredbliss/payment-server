import fs from 'fs';
import Mailgun from 'mailgun-js';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

if (!apiKey || !domain) {
  throw 'Please add Mailgun config to environment variables. See .env.example';
}

const mailgun = Mailgun({ apiKey, domain });

export { mailgun }
