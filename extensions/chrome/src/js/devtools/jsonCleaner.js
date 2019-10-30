import _ from 'underscore';

const jsonCleaner = (obj, parentKey) => {
  // don't remove the typename
  if (parentKey === '__typename' && _.isString(obj)) {
    return obj;
  }
  if (_.isArray(obj)) {
    return _.map(obj, jsonCleaner);
  }
  if (_.isObject(obj)) {
    // recursion
    return _.mapObject(obj, jsonCleaner);
  }
  if (_.isString(obj)) {
    return 'string';
  }
  if (_.isBoolean(obj)) {
    return 'boolean';
  }
  if (_.isNumber(obj)) {
    return 'number';
  }
  if (_.isNull(obj)) {
    return 'null';
  }
};

export default jsonCleaner;
