import merge from 'lodash/merge';
import _ from 'underscore';
import { mergeTypes, mergeNewType } from './contributionToTypes';

const fieldFromValue = (value, name) => {
  if (value === 'null') return { name, isNullableType: true };
  if (value === 'string') return { name, type: { name: 'String', kind: 'SCALAR' } };
  if (value === 'boolean') return { name, type: { name: 'Boolean', kind: 'SCALAR' } };
  if (value === 'number') return { name, type: { name: 'Float', kind: 'SCALAR' } };
  if (_.isArray(value)) {
    return { name, isListType: true, type: merge(..._.map(value, val => (fieldFromValue(val, name) || {}).type)) };
  }
  if (_.isObject(value)) {
    return {
      name,
      type: { name: value.__typename || `${name}__UnknownType`, kind: 'OBJECT' },
    };
  }
};

const getRecursiveTypes = result => {
  let types = {};
  if (result && typeof result === 'object') {
    if (result.__typename) {
      const newType = {
        name: result.__typename,
        kind: 'OBJECT',
        fields: _.compact(
          _.mapObject(result, (value, key) => {
            if (key === '__typename') {
              return;
            }
            return fieldFromValue(value, key);
          })
        ),
      };
      types = mergeNewType(types, newType);
    }
    _.each(result, (child, key) => {
      if (key !== '__typename') {
        types = mergeTypes(types, getRecursiveTypes(child));
      }
    });
  }

  return types;
};

const searchResponseBodyTypes = responseBody => {
  let types = {};
  _.each(responseBody, (queryResult, queryName) => {
    const queryResultTypes = getRecursiveTypes(queryResult);
    types = mergeTypes(types, queryResultTypes);
  });
  return types;
};

export default searchResponseBodyTypes;
