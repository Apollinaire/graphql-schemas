import merge from 'lodash/merge';
import _ from 'underscore';
import { mergeTypes, mergeNewType } from './contributionToTypes';


const fieldFromValue = (value, name) => {
  if (value === 'null') return { name, isNullableType: true };
  if (value === 'string') return { name, type: { name: 'String', kind: 'Scalar' } };
  if (value === 'boolean') return { name, type: { name: 'Boolean', kind: 'Scalar' } };
  if (value === 'number') return { name, type: { name: 'Float', kind: 'Scalar' } };
  if (_.isArray(value)) {
    return { name, isListType: true, type: merge(..._.map(value, val => fieldFromValue(val, name))) };
  }
  if (_.isObject(value)) {
    return {
      name,
      type: { name: value.__typename || `${name}__UnknownType`, kind: 'Type' },
    };
  }
};

const getRecursiveTypes = result => {
  let types = {};
  if (result && typeof result === 'object') {
    if (result.__typename) {
      const newType = {
        name: result.__typename,
        fields: _.mapObject(result, (value, key) => {
          if (key === '__typename') {
            return;
          }
          return fieldFromValue(value, key);
        }),
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