import { mailgun } from '../config/mailgun';

export class MailGunServiceProd {
  static send(email, onSuccess, onError) {
    return mailgun.messages().send(email, (error, body) => {
      if (error) {
        console.log('Error sending email', email, body);
        if (onError) {
          onError(error);
        }
        return;
      }

      console.log('Mailgun sent email');
      if (onSuccess) {
        onSuccess();
      };
    });
  }
}
