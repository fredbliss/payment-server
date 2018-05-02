import { ServiceRequest } from '../../../services';
import { User, Car } from '../../../models';

export class ApiServiceRequestController {
  static create(req, res) {
    const { template } = req.body;

    const user = new User(req.body.user);
    const body = {
      ...req.body.body,
      car: new Car(req.body.body.car)
    };

    ServiceRequest.send({ user, template, body }).subscribe(
      () => res.json(),
      () => onError(res)
    );
  }
}

const onError = (res) => () => {
  res.status(500).json({
    message: 'Could not send message',
  });
};
