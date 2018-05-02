import * as _ from 'lodash';

export class Model {
  toParams(){
    return _.chain(this)
      .omitBy(_.isNil)
      .omitBy(_.isFunction)
      .value();
  }
}
