import _ from 'underscore';
import searchQueryTypes from './searchQueryTypes';
import searchResponseBodyTypes from './searchResponseBodyTypes';

export interface Arg {
  name: string;
  description: string;
  type: {
    name: string;
    kind: string;
  };
}

export interface Field {
  name: string;
  description?: string;
  isListType?: boolean;
  isNullableType?: boolean;
  args?: Arg[];
  type?: {
    name?: string;
    kind?: string;
  };
}

export interface ArrayType {
  name: string;
  fields: Field[];
}

export type ArrayTypes = ArrayType[];

export interface ObjectType {
  name: string;
  fields: {
    [key: string]: Field;
  };
}

export interface ObjectTypes {
  [key: string]: ObjectType;
}

export const arrayToObjectType = (type: ArrayType): ObjectType => {
  return {
    ...type,
    fields: _.object(_.map(type.fields, field => [field.name, field])),
  };
};

export const arrayToObjectTypes = (arrayTypes: ArrayTypes): ObjectTypes => {
  return _.object(_.map(arrayTypes, type => [type.name, arrayToObjectType(type)]));
};

export const objectToArrayType = (type: ObjectType): ArrayType => {
  return { ...type, fields: _.values(type.fields) };
};

export const objectToArrayTypes = (objectTypes: ObjectTypes): ArrayTypes => {
  return _.values(_.mapObject(objectTypes, type => objectToArrayType(type)));
};

export const isObjectType = (type: any): boolean => {
  if (!_.isObject(type)) {
    return false;
  }
  if (!_.isString(type.name) || _.isEmpty(type.name)) {
    return false;
  }
  if (!_.isObject(type.fields) || _.isArray(type.fields)) {
    return false;
  }
  let allFieldsOk = true;
  _.each(type.fields, (value: any, key) => {
    if (!_.isObject(value) || value.name !== key) {
      allFieldsOk = false;
    }
  });
  return allFieldsOk;
};

// const isArrayType = type => {};

export const mergeNewType = (types: ObjectTypes, newType: ObjectType): ObjectTypes => {
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

export const mergeTypes = (types1: ObjectTypes, types2: ObjectTypes): ObjectTypes => {
  let result = {};
  _.each(types1, type => {
    result = mergeNewType(result, type);
  });
  _.each(types2, type => {
    result = mergeNewType(result, type);
  });
  return result;
};

const contributionToTypes = (queryStr: string, responseBody: any): ObjectTypes => {
  const queryTypes = searchQueryTypes(queryStr);
  const responseBodytypes = searchResponseBodyTypes(responseBody);

  const types = mergeTypes(queryTypes, responseBodytypes);
  return types;
};

export default contributionToTypes;
