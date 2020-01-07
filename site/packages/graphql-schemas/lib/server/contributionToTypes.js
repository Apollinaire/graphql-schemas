import _ from 'underscore';
import searchQueryTypes from './searchQueryTypes';
import searchResponseBodyTypes from './searchResponseBodyTypes';

export const arrayToObjectType = type => {
  return {
    ...type,
    fields: _.object(_.map(type.fields, field => [field.name, field])),
  };
};

export const arrayToObjectTypes = arrayTypes => {
  return _.object(_.map(arrayTypes, (type, index) => [type.name, arrayToObjectType(type)]));
};

export const objectToArrayType = type => {
  return { ...type, fields: _.values(type.fields) };
};

export const objectToArrayTypes = objectTypes => {
  return _.values(_.mapObject(objectTypes, type => objectToArrayType(type)));
};

export const mergeNewType = (types, newType) => {
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

export const mergeTypes = (types1, types2) => {
  let result = {};
  _.each(types1, type => {
    result = mergeNewType(result, type);
  });
  _.each(types2, type => {
    result = mergeNewType(result, type);
  });
  return result;
};

const contributionToTypes = (queryStr, responseBody) => {
  const queryTypes = searchQueryTypes(queryStr);
  const responseBodytypes = searchResponseBodyTypes(responseBody);

  const types = mergeTypes(queryTypes, responseBodytypes);
  return types;
};

export default contributionToTypes;
