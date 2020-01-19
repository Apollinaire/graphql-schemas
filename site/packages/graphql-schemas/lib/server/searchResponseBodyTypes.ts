import merge from 'lodash/merge';
import _ from 'underscore';
import { mergeTypes, mergeNewType, Field, ObjectTypes } from './contributionToTypes';

const fieldFromValue = (value: any, name: string): Field => {
  if (value === 'null') return { name, isNullableType: true };
  if (value === 'string') return { name, type: { name: 'String', kind: 'SCALAR' } };
  if (value === 'boolean') return { name, type: { name: 'Boolean', kind: 'SCALAR' } };
  if (value === 'number') return { name, type: { name: 'Float', kind: 'SCALAR' } };
  if (_.isArray(value)) {
    return {
      name,
      isListType: true,
      type: merge({}, ..._.map(value, val => (fieldFromValue(val, name) || {}).type)),
    };
  }
  if (_.isObject(value)) {
    // TODO go deeper to create the unknown type
    return {
      name,
      type: { name: value.__typename || `${name}__UnknownType`, kind: 'OBJECT' },
    };
  }
  return { name };
};

const getRecursiveTypes = (result: {[key:string]: any}): ObjectTypes => {
  let types = {};
  if (result && typeof result === 'object') {
    if (result.__typename) {
      const newType = {
        name: result.__typename,
        kind: 'OBJECT',
        fields: _.object(
          _.map(
            _.compact(
              _.values(
                _.mapObject(result, (value, key) => {
                  if (key === '__typename') {
                    return;
                  }
                  return fieldFromValue(value, key);
                })
              )
            ),
            (field: Field) => [field.name, field]
          )
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

const searchResponseBodyTypes = (responseBody: {[key:string]: any}): ObjectTypes => {
  let types = {};
  _.each(responseBody, queryResult => {
    const queryResultTypes = getRecursiveTypes(queryResult);
    types = mergeTypes(types, queryResultTypes);
  });
  return types;
};

export default searchResponseBodyTypes;
