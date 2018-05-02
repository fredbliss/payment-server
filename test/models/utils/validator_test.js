const expect = require('expect.js');

import { Validator } from '../../../src/models/utils';

describe('Validator', () => {
  describe('chaining', () => {
    describe('required', () => {
      describe('with asEmail', () => {
        it('prioritizes required', () => {
          const validator = Validator
            .require(['name', 'email'])
            .asEmail(['email']);
          const validation = validator.validate();

          expect(validation).to.eql([
            { field: 'name', message: 'Name should not be blank' },
            { field: 'email', message: 'Email should not be blank' }
          ]);
        })

        it('returns only if invalid field is present', () => {
          const validator = Validator.require(['email']).asEmail(['email']);
          const validation = validator.validate({ email: 'invalid email' });

          expect(validation).to.eql([
            { field: 'email', message: 'Email is an invalid email' }
          ]);
        })
      });

      describe('with withChildren', () => {
        it('prioritizes required', () => {
          const validator = Validator
            .require(['name', 'cars'])
            .withChildren(['cars'],
              car => Validator.require(['title']).validate(car));
          const validation = validator.validate();

          expect(validation).to.eql([
            { field: 'name', message: 'Name should not be blank' },
            { field: 'cars', message: 'Cars should not be blank' }
          ]);
        });

        it('returns no errors if children empty', () => {
          const validator = Validator
            .require(['name', 'cars'])
            .withChildren(['cars'],
              car => Validator.require(['title']).validate(car));
          const validation = validator.validate({ cars: [] });

          expect(validation).to.eql([
            { field: 'name', message: 'Name should not be blank' }
          ]);
        });

        it('returns only if invalid children is not empty', () => {
          const validator = Validator
            .require(['name', 'cars'])
            .withChildren(['cars'],
              car => Validator.require(['title']).validate(car));
          const validation = validator.validate({ cars: [{}] });

          expect(validation).to.eql([
            { field: 'name', message: 'Name should not be blank' },
            { cars: [{ field: 'title', message: 'Title should not be blank' }] }
          ]);
        });
      });
    });
  });

  describe('require', () => {
    it('returns empty array when no fields are passed', () => {
      const validator = Validator.require();
      const validation = validator.validate({ name: 'Juan' });
      expect(validation).to.eql([]);
    });

    it('returns empty array when valid', () => {
      const validator = Validator.require(['name']);
      const validation = validator.validate({ name: 'Juan' });
      expect(validation).to.eql([]);
    });

    it('returns array of missing fields', () => {
      const validator = Validator.require(['name', 'height', 'age']);
      const validation = validator.validate({ name: 'Juan' });

      expect(validation).to.eql([
        { field: 'height', message: 'Height should not be blank' },
        { field: 'age', message: 'Age should not be blank' }
      ]);
    });

    it('returns array of missing fields when no object is passed', () => {
      const validator = Validator.require(['name', 'age']);
      const validation = validator.validate();

      expect(validation).to.eql([
        { field: 'name', message: 'Name should not be blank' },
        { field: 'age', message: 'Age should not be blank' }
      ]);
    });
  });

  describe('asEmail', () => {
    it('returns empty array when valid', () => {
      const validator = Validator.asEmail(['email']);
      const validation = validator.validate({ email: 'juan@email.com' });
      expect(validation).to.eql([]);
    });

    it('returns empty array when no fields are passed', () => {
      const validator = Validator.asEmail();
      const validation = validator.validate({ email: 'Juan' });
      expect(validation).to.eql([]);
    });

    it('returns array of invalid fields', () => {
      const validator = Validator.asEmail(['email', 'oldEmail']);
      const validation = validator
        .validate({ email: 'juan@email.com', oldEmail: 'invalidEmail' });

      expect(validation).to.eql([
        { field: 'oldEmail', message: 'Old Email is an invalid email' }
      ]);
    });

    it('returns empty array when no object is passed', () => {
      const validator = Validator.asEmail(['email', 'oldEmail']);
      const validation = validator.validate();

      expect(validation).to.eql([]);
    });
  });

  describe('minLength', () => {
    it('returns empty array when valid', () => {
      const validator = Validator.minLength(['password'], 6);
      const validation = validator.validate({ password: '123456' });
      expect(validation).to.eql([]);
    });

    it('returns empty array when no fields are passed', () => {
      const validator = Validator.minLength();
      const validation = validator.validate({ password: '1234' });
      expect(validation).to.eql([]);
    });

    it('returns array of invalid fields', () => {
      const validator = Validator.minLength(['password', 'name'], 6);
      const validation = validator
        .validate({ password: '1234', name: 'John Snow' });

      expect(validation).to.eql([
        { field: 'password', message: 'Password should contain at least 6 characters' }
      ]);
    });

    it('returns empty array when no object is passed', () => {
      const validator = Validator.minLength(['password', 'name'], 6);
      const validation = validator.validate();

      expect(validation).to.eql([]);
    });
  });

  describe('with children', () => {
    it('returns empty if children are valid', () => {
      const validator = Validator.withChildren(
        ['ownedCars', 'watchedCars'],
        car => Validator.require(['make']).validate(car)
      );
      const validation = validator.validate({
        ownedCars: [{ make: 'porsche' }],
        watchedCars: [{ make: 'Toyota' }]
      });

      expect(validation).to.eql([]);
    });

    describe('when missing children field', () => {
      it('validates children', () => {
        const validator = Validator.withChildren(
          ['ownedCars', 'watchedCars'],
          car => Validator.require(['make']).validate(car)
        );
        const validation = validator.validate({
          ownedCars: [{ model: 'porsche' }],
          watchedCars: [{ model: 'Toyota '}]
        });

        expect(validation).to.eql([
          { ownedCars: [{
              field: 'make',
              message: 'Make should not be blank' }] },
          { watchedCars: [{
            field: 'make',
            message: 'Make should not be blank' }] }
        ]);
      });
    });

    describe('when children are blank', () => {
      it('returns blank array', () => {
        const validator = Validator.withChildren(
          ['ownedCars', 'watchedCars'],
          car => Validator.require(['make']).validate(car)
        );
        const validation = validator.validate({ ownedCars: [{}]});

        expect(validation).to.eql([
          { ownedCars: [{
            field: 'make',
            message: 'Make should not be blank' }] }
        ]);
      })
    });
  });
});
