import { stripe, plan } from '../config/stripe';
import * as _ from 'lodash';

export class StripeService {
  static subscribeCustomer({ stripeCustomerId, email, source, coupon }) {
    if (stripeCustomerId) {
      return stripe.subscriptions.create(_.omitBy({ customer: stripeCustomerId, plan, coupon }, _.isNil));
    } else {
      return stripe.customers.create({ email, source })
        .then(customer =>
          stripe.subscriptions.create(_.omitBy({ customer: customer.id, plan, coupon }, _.isNil))
            .catch(err => {
              err.stripeCustomerId = customer.id;
              throw(err);
        }))
        .then(subscription =>
          new Promise(resolve => resolve({ subscription })));
    }
  }
}
