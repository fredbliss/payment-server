import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

export var environment = {
  label: 'Test',
  production: false,
  test: true,
  mailgun: false,
  mailchimp: false,
  serviceRequestEmail: process.env.SERVICE_REQUEST_TEST_EMAIL || '',
  port: 3099,
  registrationAlertEmails: [
    process.env.SERVICE_REQUEST_TEST_EMAIL || '',
    process.env.SERVICE_REQUEST_TEST_EMAIL2 || '',
  ],
};
