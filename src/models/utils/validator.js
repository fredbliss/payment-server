import * as _ from 'lodash';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export class Validator {
  constructor({ requiredFields, emailFields, childrenFields, minLengthFields }) {
    this.requiredFields = requiredFields || [];
    this.emailFields = emailFields || [];
    this.childrenFields = childrenFields || [];
    this.minLengthFields = minLengthFields || [];
  }

  static require(requiredFields = []) {
    return new Validator({ requiredFields });
  }

  static asEmail(emailFields = []) {
    return new Validator({ emailFields });
  }

  static withChildren(fields, validator) {
    return new Validator({ childrenFields:
      [{ fields, validator }]
    });
  }

  static minLength(fields, length) {
    return new Validator({ minLengthFields:
      [{ fields, length }]
    });
  }

  asEmail(emailFields = []) {
    return new Validator({ ...this, emailFields });
  }

  withChildren(fields, validator) {
    return new Validator({ ...this, childrenFields:
      [{ fields, validator }]
    });
  }

  minLength(fields, length) {
    return new Validator({ ...this, minLengthFields:
      [{ fields, length }]
    });
  }

  validate(params = {}) {
    const required = this.requiredFields
      .filter(field => !params[field])
      .map(field => {
        return { field, message: `${_.startCase(field)} should not be blank` }
      });

    const asEmail = this.emailFields
      .filter(field => params[field])
      .filter(field => !params[field].match(EMAIL_REGEX))
      .map(field => {
        return { field, message: `${_.startCase(field)} is an invalid email` }
      });

    const minLength = _.flatMap(this.minLengthFields,
      minLengthFields =>
        _.chain(minLengthFields.fields)
          .filter(field => params[field])
          .filter(field => params[field].length < minLengthFields.length)
          .map(field => ({
            field,
            message: `${_.startCase(field)} should contain at least ` +
                     `${minLengthFields.length} characters` }))
          .value()
    );

    const withChildren = _.flatMap(this.childrenFields,
      childrenFields =>
        _.flatMap(childrenFields.fields,
          children =>
            _.chain(params[children])
              .flatMap(child => ({
                [children]: childrenFields.validator(child) }))
              .filter(validations => _.flatten(_.values(validations)).length)
              .value()
          )
      );

    return [...required, ...asEmail, ...withChildren, ...minLength];
  }
}
