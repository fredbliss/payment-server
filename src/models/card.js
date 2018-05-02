export class Card {
  constructor({number, month, year, cvc}) {
    this.number = number;
    this.month = month;
    this.year = year;
    this.cvc = cvc;
  }

  toStripeParams() {
    return {
      object: 'card',
      number: this.number,
      exp_month: this.month,
      exp_year: this.year,
      cvc: this.cvc
    };
  }
}
