import { stripe } from '../config/stripe';

export class CouponService {
  static get(id) {
    return stripe.coupons.retrieve(id);
  }
}
