import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

const privateKey = process.env.STRIPE_PRIVATE_KEY;
const plan = process.env.STRIPE_PLAN_ID;

if (!privateKey || !plan) {
  throw 'Please add Stripe config to environment variables. See .env.example';
}

const stripe = require('stripe')(privateKey);

export {
  stripe,
  plan
};
