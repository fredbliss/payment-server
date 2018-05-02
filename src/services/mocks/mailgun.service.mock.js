import * as _ from 'lodash';

export class MailgunServiceMock {
  static send(email, onSuccess, _onError) {
    console.log('[MOCK] Mailgun sent email to', _.omit(email, 'html'));
    if (onSuccess) setTimeout(onSuccess);
  }
}
