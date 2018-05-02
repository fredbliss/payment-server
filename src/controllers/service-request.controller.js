import { Email } from '../models';
import { MailgunService } from '../services';
import { environment } from '../environments/environment';

export class ServiceRequestController {
  static create(req, res) {
    const { subject, body, from, firstName } = req.body;

    const email = buildEmail({ from, subject, text: body });
    const confirmationEmail = buildConfirmationEmail({ firstName, to: from });

    MailgunService.send(email,
      () => {
        MailgunService.send(confirmationEmail,
          () => res.json(),
          onError(res))
      },
      onError(res))
  }
}

const onError = (res) => () => {
  res.status(500).json({
    message: 'Could not send message',
  });
}

const buildEmail = ({ from, subject, text }) => {
  return new Email({
    to: environment.serviceRequestEmail,
    from,
    subject,
    text
  });
}

const buildConfirmationEmail = ({ firstName, to }) => {
  return new Email({
    from: environment.serviceRequestEmail,
    subject: 'Thank you for your inquiry',
    text: `
      Hello ${firstName},

      thank you for your inquiry.

      We have received your service request and will reply as soon as possible.
    `,
    to
  });
}
