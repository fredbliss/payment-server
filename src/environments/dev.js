import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

export var environment = {
  label: 'Development',
  production: false,
  development: true,
  test: false,
  mailgun: false,
  mailchimp: false,
  serviceRequestEmail: process.env.SERVICE_REQUEST_TEST_EMAIL || '',
  port: 3001,
  registrationAlertEmails: [
    process.env.SERVICE_REQUEST_TEST_EMAIL || '',
    process.env.SERVICE_REQUEST_TEST_EMAIL2 || '',
  ],
};
