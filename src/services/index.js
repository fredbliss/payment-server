import { environment } from '../environments/environment';

// Mailgun
import { MailGunServiceProd } from './mailgun.service';
import { MailgunServiceMock } from './mocks/mailgun.service.mock';
const MailgunService = environment.mailgun ? MailGunServiceProd : MailgunServiceMock;

// Mailchimp
import { MailchimpServiceProd } from './mailchimp.service';
import { MailchimpServiceMock } from './mocks/mailchimp.service.mock';
const MailchimpService = environment.mailchimp ? MailchimpServiceProd : MailchimpServiceMock;

// Exports
export { MailchimpService };
export { MailgunService };

export * from './service-request.service';
export * from './stripe.service';
export * from './coupon.service';
export * from './firebase.service';
export * from './registration-alert.service';
