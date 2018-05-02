import { Model } from './utils';

export class Car extends Model {
  constructor(params = {}) {
    super();
    this.uid = params.uid;
    this.description = params.description;
    this.year = params.year;
    this.make = params.make;
    this.model = params.model;
    this.image = params.image;
    this.photoCredits = params.photoCredits;
    this.estimatedValue = params.estimatedValue;
  }
}
