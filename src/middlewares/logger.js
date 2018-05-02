import morgan from 'morgan';
import { environment } from '../environments/environment';

function makeLogger() {
  if (environment.production) {
    return morgan('combined');
  }

  if (environment.development) {
    return (req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    };
  }

  return (req, res, next) => {
    next();
  };
}

export const logger = makeLogger();
