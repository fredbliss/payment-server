import express from 'express';

import { environment } from './src/environments/environment';
import { cors, bodyParserJson, logger } from './src/middlewares';
import {
  RegistrationController,
  ServiceRequestController,
  CouponsController,
  ApiRegistrationController,
  ApiServiceRequestController,
} from './src/controllers';

const app = express();

app.use(bodyParserJson);
app.use(cors);
app.use(logger);

app.post('/api/v1/registrations/alert', ApiRegistrationController.alert);
app.post('/api/v1/registrations', ApiRegistrationController.create);
app.post('/api/v1/registrations/bulk', ApiRegistrationController.createBulk);
app.post('/api/v1/service-request', ApiServiceRequestController.create);

app.post('/register', RegistrationController.create);
app.post('/service-request', ServiceRequestController.create);
app.get('/coupons/:id', CouponsController.get);

const port = process.env.PORT || environment.port;
app.listen(port, () => {
  console.log(`BlockChaser Payment Server listening on port ${port}.`);
  console.log(`Environment: ${environment.label}`);
});

export default app;
