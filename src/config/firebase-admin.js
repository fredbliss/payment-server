import fs from 'fs';
import { environment } from '../environments/environment';

const firebase = require('firebase-admin');

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

const projectId = environment.production
  ? process.env.FIREBASE_PROJECT_ID
  : process.env.TEST_FIREBASE_PROJECT_ID;
const clientEmail = environment.production
  ? process.env.FIREBASE_CLIENT_EMAIL
  : process.env.TEST_FIREBASE_CLIENT_EMAIL;
const privateKey = environment.production
  ? process.env.FIREBASE_PRIVATE_KEY
  : process.env.TEST_FIREBASE_PRIVATE_KEY;
const databaseURL = environment.production
  ? process.env.FIREBASE_DATABASE_URL
  : process.env.TEST_FIREBASE_DATABASE_URL;

if (!projectId || !clientEmail || !privateKey || !databaseURL) {
  throw 'Please add Firebase config to environment variables. See .env.example';
}

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId,
    clientEmail,
    privateKey
  }),
  databaseURL
});

export { firebase };
