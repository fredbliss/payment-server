import * as _ from 'lodash';

import { Car } from './';
import { Model } from './utils';
import uuid from 'node-uuid';

export class User extends Model {
  constructor(params = {}) {
    super();
    this.uid = params.uid;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.username = params.username;
    this.email = params.email;
    this.postal = params.postal;
    this.state = params.state;
    this.country = params.country;
    this.active = params.active;
    this.tier = params.tier;
    this.avatar = params.avatar;
    this.stripeCustomerId = params.stripeCustomerId;
    this.ownedCars = buildCars(params.ownedCars);
    this.watchedCars = buildCars(params.watchedCars);
    this.version = params.version;
    this.providers = params.providers;
  }

  static buildNewUser(params) {
    const newParams = {
      ...params,
      ownedCars: (params.ownedCars || [])
        .map(car => ({ ...car, uid: uuid.v4() })),
      watchedCars: (params.watchedCars || [])
        .map(car => ({ ...car, uid: uuid.v4() })),
    };

    return new User(newParams);
  }

  toParams() {
    return _.assign({},
      super.toParams(),
      _.omit('name'),
      _.omitBy(this, _.isNil),
      {
        ownedCars: this.ownedCars.map(car => car.toParams()),
        watchedCars: this.watchedCars.map(car => car.toParams())
      });
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const buildCars = (params = []) => {
  return params.map(attr => new Car(attr));
};
