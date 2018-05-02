import request from 'supertest';
import expect from 'expect.js';
import server from '../../../../server';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../../../src/services';

const randomId = () => Math.floor(Math.random() * 10000);

const credentials = {
  email: `api-test-${randomId()}@registration.com`,
  firstName: 'John',
  lastName: 'Snow',
  password: '123456',
  tier: 'PREMIUM',
  avatar: 'avatarUrl',
  username: 'johnsnow',
  ownedCars: [{
    make: 'Porsche',
    year: '1987',
    model: '911'
  }],
  watchedCars: [{
    make: 'Chevrolet',
    year: '1985',
    model: 'Camaru'
  }]
};

const credentials2 = {
  ...credentials,
  email: `api-test-${randomId()}@registration.com`
};

const freeUser = {
  ...credentials,
  email: `api-test-${randomId()}@registration.com`,
  tier: 'FREE'
};

const freeUser2 = {
  ...credentials,
  email: `api-test-${randomId()}@registration.com`,
  tier: 'FREE'
};

const card = {
  number: '4242424242424242',
  cvc: '123',
  expMonth: '12',
  expYear: '2050'
};

const coupon = '50_OFF';
const invalidCoupon = 'INVALID';

describe('RegistrationsController', () => {
  after((done) => {
    const delete1 = FirebaseService.deleteUserByEmail(credentials.email).catch(() => Observable.empty());
    const delete2 = FirebaseService.deleteUserByEmail(credentials2.email).catch(() => Observable.empty());
    const delete3 = FirebaseService.deleteUserByEmail(freeUser.email).catch(() => Observable.empty());
    const delete4 = FirebaseService.deleteUserByEmail(freeUser2.email).catch(() => Observable.empty());

    delete1.merge(delete2, delete3, delete4).subscribe(
      () => {},
      () => done(),
      () => done()
    );
  });

  describe('when valid', () => {
    it('registers with coupon', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user: credentials, card, coupon })
        .expect(function(res) {
          const { user } = res.body;
          const ownedCar = user.ownedCars[0];
          const watchedCar = user.watchedCars[0];

          expect(user.stripeCustomerId).to.be.present;
          expect(user.uid).to.be.present;
          expect(user.version).to.eql(2);
          expect(user.providers).to.eql(['password']);
          expect(user.active).to.eql(true);
          expect(user.email).to.eql(credentials.email);
          expect(user.firstName).to.eql(credentials.firstName);
          expect(user.lastName).to.eql(credentials.lastName);
          expect(user.avatar).to.eql(credentials.avatar);
          expect(user.username).to.eql(credentials.username);

          expect(ownedCar.uid).to.be.present;
          expect(ownedCar.year).to.eql(credentials.ownedCars[0].year);
          expect(ownedCar.make).to.eql(credentials.ownedCars[0].make);
          expect(ownedCar.model).to.eql(credentials.ownedCars[0].model);

          expect(watchedCar.uid).to.be.present;
          expect(watchedCar.year).to.eql(credentials.watchedCars[0].year);
          expect(watchedCar.make).to.eql(credentials.watchedCars[0].make);
          expect(watchedCar.model).to.eql(credentials.watchedCars[0].model);
        })
        .expect(200, done);
    });

    it('registers and send email', (done) => {
      const email = {
        subject: 'Welcome',
        text: 'to Block Chaser family!'
      };

      request(server)
        .post('/api/v1/registrations')
        .send({ user: freeUser2, options: { email }})
        .expect(function(res) {
          const { user } = res.body;

          expect(user.uid).to.be.present;
          expect(user.version).to.eql(2);
          expect(user.providers).to.eql(['password']);
          expect(user.active).to.eql(true);
          expect(user.email).to.eql(freeUser2.email);
          expect(user.firstName).to.eql(freeUser2.firstName);
        })
        .expect(200, done);
    });

    it('registers without coupon', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user: credentials2, card })
        .expect(function(res) {
          const { user } = res.body;

          expect(user.stripeCustomerId).to.be.present;
          expect(user.uid).to.be.present;
          expect(user.version).to.eql(2);
          expect(user.providers).to.eql(['password']);
          expect(user.active).to.eql(true);
          expect(user.email).to.eql(credentials2.email);
          expect(user.firstName).to.eql(credentials2.firstName);
        })
        .expect(200, done);
    });

    describe('when PREMIUM tier', () => {
      const premium = {
        ...credentials,
        email: `api-test-${randomId()}@registration.com`,
        tier: 'PREMIUM'
      };

      it('fails without card', (done) => {
        request(server)
          .post('/api/v1/registrations')
          .send({ user: premium })
          .expect(422, {
            status: 'ERROR',
            code: 'tier/missing_card',
            message: 'Missing card when registering a premium account'
          }, done);
      });
    });

    describe('when INVALID tier', () => {
      const invalid = {
        ...credentials,
        email: `api-test-${randomId()}@registration.com`,
        tier: 'INVALID_TIER'
      };

      it('fails', (done) => {
        request(server)
          .post('/api/v1/registrations')
          .send({ user: invalid })
          .expect(422, {
            status: 'ERROR',
            code: 'tier/invalid',
            message: 'Invalid tier: INVALID_TIER'
          }, done);
      });
    });

    describe('when FREE tier', () => {
      const freeUserCancelled = {
        ...freeUser,
        email: `api-test-${randomId()}@registration.com`
      };

      it('registers without card', (done) => {
        request(server)
          .post('/api/v1/registrations')
          .send({ user: freeUser })
          .expect(function(res) {
            const { user } = res.body;

            expect(user.stripeCustomerId).to.not.be.present;
            expect(user.version).to.eql(2);
            expect(user.providers).to.eql(['password']);
            expect(user.active).to.eql(true);
            expect(user.uid).to.be.present;
            expect(user.email).to.eql(freeUser.email);
            expect(user.firstName).to.eql(freeUser.firstName);
          })
          .expect(200, done);
      });

      it('fails with card', (done) => {
        request(server)
          .post('/api/v1/registrations')
          .send({ user: freeUserCancelled, card })
          .expect(422, {
            status: 'ERROR',
            code: 'tier/free_with_card',
            message: 'Free tier registrations should not charge cards'
          }, done);
      });
    });
  });

  describe('when email exists', () => {
    it('return email already used error', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user: credentials, card, coupon })
        .expect(
          422,
          {
            status: 'ERROR',
            code: 'auth/email-already-exists',
            message: 'The email address is already in use by another account.'
          },
          done);
    });
  });

  describe('with invalid credentails', () => {
    const invalid = {
      ownedCars: [{
        year: '1987',
        model: '911'
      }],
      watchedCars: [{
        make: 'Chevrolet',
        model: 'Camaru'
      }]
    };

    it('return validation errors', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user: invalid, card, coupon })
        .expect(
          422,
          {
            status: 'ERROR',
            code: 'auth/user-invalid',
            errors: [
              {
                field: 'email',
                message: 'Email should not be blank'
              },
              {
                field: 'password',
                message: 'Password should not be blank'
              },
              {
                field: 'firstName',
                message: 'First Name should not be blank'
              },
              {
                ownedCars: [
                  {
                    field: 'make',
                    message: 'Make should not be blank'
                  }
                ]
              },
              {
                watchedCars: [
                  {
                    field: 'year',
                    message: 'Year should not be blank'
                  }
                ]
              }
            ],
            message: 'User is invalid'
          },
          done);
    });
  });

  describe('with invalid card', function() {
    const user = {
      ...credentials,
      email: `api-test-${randomId()}@registration.com`
    };

    const expiredCard = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '12',
      expYear: '2000'
    };

    it ('returns error', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user, card: expiredCard, coupon })
        .expect(
          422,
          {
            status: 'ERROR',
            code: 'payment',
            message: 'Your card\'s expiration year is invalid.'
          },
          done);
    });
  });

  describe('with invalid coupon', function() {
    const user = {
      ...credentials,
      email: `api-test-${randomId()}@registration.com`
    };

    it ('returns error', (done) => {
      request(server)
        .post('/api/v1/registrations')
        .send({ user, card, coupon: invalidCoupon })
        .expect(
          422,
          {
            status: 'ERROR',
            code: 'payment',
            message: 'No such coupon: INVALID'
          },
          done);
    });
  });

  describe('#notify', function() {
    const user = {
      ...credentials
    };

    it('sends Mailgun email without errors', (done) => {
      request(server)
        .post('/api/v1/registrations/alert')
        .send({ user })
        .expect(200, done);
    });
  });
});
