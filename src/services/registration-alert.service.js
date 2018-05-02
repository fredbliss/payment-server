import { environment } from '../environments/environment';

import { MailgunService, MailchimpService } from './';
import template from '../templates/email/registration-alert.email';

export class RegistrationAlertService {
  static send(user, onSuccess, onError) {
    const email = {
      to: environment.registrationAlertEmails,
      from: environment.serviceRequestEmail,
      subject: 'NEW REGISTRATION',
      html: template(user),
    };

    if (user.active) {
      MailchimpService.subscribe(user.email);
      MailgunService.send(email, onSuccess, onError);
    } else {
      if (onSuccess) { onSuccess(); }
    }
  }
};
