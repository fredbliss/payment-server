import { Card } from '../models';
import { StripeService } from '../services';

export class RegistrationController {
  static create(req, res) {
    const { email, card, coupon, stripeCustomerId } = req.body;
    const source = buildStripeCardSource(card);

    StripeService.subscribeCustomer({ email, source, stripeCustomerId, coupon })
      .then(
        response => {
          res.json({
            message: 'Customer subscribed',
            subscription: response.subscription
          });
        },
        stripeError(res));
  }
}

const stripeError = (res) => (error) => {
  res.status(error.statusCode).json({
    stripeCustomerId: error.stripeCustomerId,
    message: error.message,
    type: error.type
  });
};

function buildStripeCardSource(card) {
  return new Card({
      month: card.expMonth,
      year: card.expYear,
      number: card.number,
      cvc: card.cvc
    }).toStripeParams();
};
