import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import RegistrationFormEmailTemplate from '../../../templates/email/registration-form.email-template';

import {
  FirebaseService,
  MailgunService,
  StripeService,
  CouponService,
  RegistrationAlertService,
} from '../../../services';

import { User, Card } from '../../../models';
import { Validator } from '../../../models/utils';

export class ApiRegistrationController {
  static alert(req, res) {
    const userParams = req.body.user;

    const user = User.buildNewUser(userParams);

    RegistrationAlertService.send(
      user,
      () => res.json({ status: 'SUCCESS' }),
      () => res.status(500).json({ status: 'ERROR' }));
  }

  static create(req, res) {
    const userParams = (req.body || {}).user;
    const { coupon, card } = (req.body || {});
    const options = req.body.options || {};

    const { email, password } = userParams;

    const user = User.buildNewUser({
      ...userParams,
      version: 2,
      providers: ['password'],
      active: true
    });

    validateUser(userParams)
      .switchMap(() => validateTier(user, card))
      .switchMap(() => userExists(email))
      .switchMap(() => checkCoupon(coupon))
      .switchMap(() => subscribeToStripe({ user, email, card, coupon }))
      .switchMap(user => FirebaseService.createUser({ email, password }, user))
      .subscribe(
        newUser => {
          RegistrationAlertService.send(newUser);
          sendEmail({ user: newUser, password, options });
          res.json({ status: 'SUCCESS', user: newUser });
        },
        err => {
          res.status(422).json({
            status: 'ERROR',
            code: err.code,
            message: err.message,
            errors: err.errors ,
            stripeCustomerId: err.stripeCustomerId
          });
        }
      );
  }

    static createBulk(req, res) {
        const userBatch = (req.body || []);
        console.log('userBatch:', userBatch.map(u => u.email))

        const responses = []
        Observable
            .from(userBatch)
            .flatMap(userParams => {
                const { email, password } = userParams;

                const user = User.buildNewUser({ ...userParams, active: true });

                return validateUser(userParams)
                    .switchMap(() =>
                        FirebaseService.createUser({ email, password }, user)
                            .map(newUser => ({ ...newUser, status: 'SUCCESS' }))
                            .do(newUser => {
                                responses.push(newUser);
                            })
                    ).catch(err => {
                        const errorMessage = {
                            status: 'ERROR',
                            code: err.code,
                            message: err.message,
                            errors: err.errors ,
                            email: email,
                            stripeCustomerId: err.stripeCustomerId
                        };
                        responses.push(errorMessage)
                        return Observable.of(errorMessage)
                    });
            })
            .subscribe(
                (result) => {
                    console.log('NEXT', result);
                },
                (err) => res.status(500).json({ error: err }),
                () => {
                    console.log('COMPLETED');
                    res.json({ responses: responses });
                }
            );
    }
}

function userExists(email) {
  return FirebaseService.userExists(email).map(exists => {
    if (exists) {
      return Observable.throw({
        code: 'auth/email-already-exists',
        message: 'The email address is already in use by another account.'
      });
    } else {
      return Observable.of(true);
    }
  });
}

function sendEmail({ user, password, options }) {
  switch (options.emailTemplate) {
    case 'registration-form':
      const email = {
        to: user.email,
        from: environment.serviceRequestEmail,
        subject: 'Your Car\'s Value Is Waiting For You!',
        html: RegistrationFormEmailTemplate(user, password),
      };
      MailgunService.send(email);
  }
}

function checkCoupon(coupon) {
  if (coupon) {
    return Observable.defer(() => CouponService.get(coupon))
      .catch(() => Observable.throw({
        code: 'payment',
        message: `No such coupon: ${coupon}`
      }));
  } else {
    return Observable.of(true);
  }
}

function subscribeToStripe({ user, email, card, coupon }) {
  if (card) {
    const source = buildStripeCardSource(card);

    return Observable.defer(() =>
      StripeService.subscribeCustomer({ email, source, coupon })
    )
      .map(response => User.buildNewUser({
        ...user,
        stripeCustomerId: response.subscription.customer }))
      .catch(error => Observable.throw({
        message: error.message,
        code: 'payment',
        stripeCustomerId: error.stripeCustomerId
      }));
  } else {
    return Observable.of(user);
  }
}

function validateUser(params) {
  const validation = Validator
    .require(['email', 'password', 'firstName'])
    .asEmail(['email'])
    .minLength(['password'], 6)
    .withChildren(['ownedCars', 'watchedCars'], car =>
      Validator.require(['year', 'make', 'model']).validate(car)
    )
    .validate(params);

  if (validation.length) {
    return Observable.throw({
      status: 'ERROR',
      code: 'auth/user-invalid',
      message: 'User is invalid',
      errors: validation
    });
  } else {
    return Observable.of(true);
  }
}

function validateTier(user, card) {
  if (user.tier !== 'FREE' && user.tier !== 'PREMIUM') {
    return Observable.throw({
      status: 'ERROR',
      code: 'tier/invalid',
      message: `Invalid tier: ${user.tier}`
    });
  }

  if (user.tier === 'FREE' && card) {
    return Observable.throw({
      status: 'ERROR',
      code: 'tier/free_with_card',
      message: 'Free tier registrations should not charge cards'
    });
  }

  if (user.tier === 'PREMIUM' && !card) {
    return Observable.throw({
      status: 'ERROR',
      code: 'tier/missing_card',
      message: 'Missing card when registering a premium account'
    });
  }

  return Observable.of(true);
}

function buildStripeCardSource(card) {
  return new Card({
      month: card.expMonth,
      year: card.expYear,
      number: card.number,
      cvc: card.cvc
    }).toStripeParams();
}
