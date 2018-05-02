import { Observable } from 'rxjs';

export class MailchimpServiceMock {
  static subscribe(email) {
    console.log('[Mock] Mailchimp subscribed', email);
    return Observable.of(null);
  }
}
