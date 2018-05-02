import fs from 'fs';
import { Mailchimp } from 'mailchimp-api';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}
const apiKey = process.env.MAILCHIMP_API_KEY;
const mailChimpListId = process.env.MAILCHIMP_LIST_ID;

if (!apiKey || !mailChimpListId) {
  throw 'Please add Mailchimp config to environment variables. See .env.example';
}

const mailchimp = new Mailchimp(apiKey)

export { mailchimp, mailChimpListId }
