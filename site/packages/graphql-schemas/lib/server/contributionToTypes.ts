import _ from 'underscore';
import searchQueryTypes from './searchQueryTypes';
import searchResponseBodyTypes from './searchResponseBodyTypes';

export interface Arg {
  name: string;
  description?: string;
  type?: {
    name?: string;
    kind?: string;
  };
}

export type Args = {
  [key: string]: Arg;
};

export interface ArrayField {
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

export type ArrayFields = ArrayField[];

export interface ObjectField {
  name: string;
  description?: string;
  isListType?: boolean;
  isNullableType?: boolean;
  args?: {
    [key: string]: Arg;
  };
  type?: {
    name?: string;
    kind?: string;
  };
}

export interface ObjectFields {
  [key: string]: ObjectField;
}

export interface ArrayType {
  name: string;
  fields: ArrayFields;
  kind: string;
}

export type ArrayTypes = ArrayType[];

export interface ObjectType {
  name: string;
  fields: ObjectFields;
  kind: string;
}

export interface ObjectTypes {
  [key: string]: ObjectType;
}

export const arrayToObjectArgs = (fields: ArrayFields): ObjectFields => {
  return _.object(_.compact(_.map(fields, field => (field?.name ? [field.name, field] : null))));
};

export const objectToArrayArgs = (fields: ObjectFields): ArrayFields => {
  return _.values(_.mapObject(fields, objectToArrayField));
};

export const arrayToObjectField = (field: ArrayField): ObjectField => {
  return {
    ...field,
    args: _.object(_.compact(_.map(field.args || [], arg => (arg?.name ? [arg.name, arg] : null)))),
  };
};

export const arrayToObjectFields = (fields: ArrayFields): ObjectFields => {
  return _.object(_.compact(_.map(fields, field => (field?.name ? [field.name, arrayToObjectField(field)] : null))));
};

export const objectToArrayField = (field: ObjectField): ArrayField => {
  return {
    ...field,
    args: _.compact(_.values(field.args)),
  };
};

export const objectToArrayFields = (fields: ObjectFields): ArrayFields => {
  return _.values(_.mapObject(fields, objectToArrayField));
};

export const arrayToObjectType = (type: ArrayType): ObjectType => {
  return {
    ...type,
    fields: arrayToObjectFields(type.fields),
  };
};

export const arrayToObjectTypes = (arrayTypes: ArrayTypes): ObjectTypes => {
  return _.object(_.map(arrayTypes, type => [type.name, arrayToObjectType(type)]));
};

export const objectToArrayType = (type: ObjectType): ArrayType => {
  return { ...type, fields: objectToArrayFields(type.fields) };
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

export const mergeNewArg = (args: Args, newArg: Arg): Args => {
  if (args[newArg.name]) {
    return {
      ...args,
      [newArg.name]: newArg,
    };
  } else {
    return {
      ...args,
      [newArg.name]: {
        name: newArg.name,
        type: {
          ...(args[newArg.name]?.type || {}),
          ...(newArg.type || {}),
        },
      },
    };
  }
};

export const mergeArgs = (args1: Args = {}, args2: Args = {}): Args => {
  let result = {};
  _.each(args1, arg => {
    result = mergeNewArg(result, arg);
  });
  _.each(args2, arg => {
    result = mergeNewArg(result, arg);
  });
  if (!_.isEmpty(result)) {
    // console.trace();
    // console.log(args1);
    // console.log(args2);
    // console.log(result);
  }
  return result;
};

export const mergeNewField = (fields: ObjectFields, newField: ObjectField) => {
  if (!fields[newField.name]) {
    return {
      ...fields,
      [newField.name]: newField,
    };
  } else {
    return {
      ...fields,
      [newField.name]: {
        ...fields[newField.name],
        ...newField,
        args: mergeArgs(fields[newField.name].args, newField.args),
      },
    };
  }
};

export const mergeFields = (fields1: ObjectFields, fields2: ObjectFields): ObjectFields => {
  let result = {};
  _.each(fields1, field => {
    result = mergeNewField(result, field);
  });
  _.each(fields2, field => {
    result = mergeNewField(result, field);
  });
  return result;
};

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
        fields: mergeFields(types[newType.name].fields, newType.fields),
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
  // console.log(queryTypes);
  const responseBodytypes = searchResponseBodyTypes(responseBody);

  const types = mergeTypes(queryTypes, responseBodytypes);
  return types;
};

export default contributionToTypes;
