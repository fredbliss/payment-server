import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config();
}

const envConfig = process.env.ENV;

const envParam = process.argv
  .filter(args => args.match('--env'))
  .map(arg => arg.split('=')[1])[0];

const env = envConfig ? envConfig
           : envParam ? envParam
                      : 'test';

import { environment as production } from './prod';
import { environment as test } from './test';
import { environment as development } from './dev';
import { environment as qa } from './qa';

function makeEnv() {
  if (env === 'prod') {
    return production;
  }
  if (env === 'dev') {
    return development;
  }
  if (env === 'qa') {
    return qa;
  }
  return test;
}

const environment = makeEnv();
export { environment };
