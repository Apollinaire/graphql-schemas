import merge from 'lodash/merge';
import _ from 'underscore';
import { parse } from 'graphql';

const mergeTypes = (types, newType) => {
  if (!types[newType.name]) {
    return {
      ...types,
      [newType.name]: newType,
    };
  } else {
    return {
      ...types,
      [newType.name]: {
        ...types[newType.name],
        ...newType,
        fields: {
          ...types[newType.name].fields,
          ...newType.fields,
        },
      },
    };
  }
};

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

const searchResponseBody = responseBody => {
  let types = {};
  if (responseBody && typeof responseBody === 'object') {
    if (responseBody.__typename) {
      const newType = {
        name: responseBody.__typename,
        fields: _.mapObject(responseBody, (value, key) => {
          if (key === '__typename') {
            return;
          }
          return fieldFromValue(value, key);
        }),
      };
      types = mergeTypes(types, newType);
    }
  }
  return types;
};

const contributionToTypes = (queryStr, responseBody) => {
  const query = parse(queryStr);
  const types = searchResponseBody(responseBody);
  console.log(types);
};

export default contributionToTypes;
