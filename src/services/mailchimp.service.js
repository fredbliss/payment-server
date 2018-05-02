import { mailchimp, mailChimpListId } from '../config/mailchimp';
import { Subject } from 'rxjs';

export class MailchimpServiceProd {
  static subscribe(email) {
    const result = new Subject();

    mailchimp.lists.subscribe({
        id: mailChimpListId,
        email: { email: email }
      },
      () => {
        result.next();
        result.complete();
      },
      err => {
        console.error('[MAILCHIMP] Error subscribing email', email);
        result.error(err);
      });

    return result.asObservable();
  }
}
