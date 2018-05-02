import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

export var environment = {
  label: 'QA',
  production: false,
  test: false,
  mailgun: true,
  mailchimp: false,
  serviceRequestEmail: process.env.SERVICE_REQUEST_TEST_EMAIL || '',
  port: 3001,
  registrationAlertEmails: [
    process.env.SERVICE_REQUEST_TEST_EMAIL || '',
    process.env.SERVICE_REQUEST_TEST_EMAIL2 || '',
  ],
};
