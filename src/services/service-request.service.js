import { environment } from '../environments/environment';
import { Email } from '../models';
import { MailgunService } from './';
import { Subject } from 'rxjs';

import templates from '../templates/email/service-request';

export class ServiceRequest {
  static send({ user, template, body }) {
    const delivery = new Subject();
    const requestEmail = buildRequestEmail({user, template, body});
    const confirmationEmail = buildConfirmationEmail({user, template, body});

    MailgunService.send(requestEmail,
      () => MailgunService.send(confirmationEmail,
          () => onSuccess(delivery),
          err => onError(delivery, 'Confirmation Email failed', err)),
      err => onError('Request Email failed', err));

    return delivery.asObservable();
  }
};

const onSuccess = (delivery) => {
  delivery.next();
  delivery.complete();
};

const onError = (delivery, message, error) => {
  delivery.error({ message, error });
};

const buildRequestEmail = ({ user, template, body }) => {
  return new Email({
    to: environment.serviceRequestEmail,
    from: user.email,
    subject: templates[template](user, body).request.subject,
    html: templates[template](user, body).request.html,
  });
};

const buildConfirmationEmail = ({ user, template, body }) => {
  return new Email({
    from: environment.serviceRequestEmail,
    to: user.email,
    subject: templates[template](user, body).confirmation.subject,
    html: templates[template](user, body).confirmation.html,
  });
};
