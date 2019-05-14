import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import keyBy from 'lodash/keyBy';

import { typeNameToId } from './introspection'

export function assignTypesAndIDs(schema) {
  schema.queryType = schema.types[schema.queryType];
  schema.mutationType = schema.types[schema.mutationType];
  schema.subscriptionType = schema.types[schema.subscriptionType];

  each(schema.types, type => {
    type.id = typeNameToId(type.name);

    each(type.inputFields, field => {
      field.id = `FIELD::${type.name}::${field.name}`;
      field.type = schema.types[field.type];
    });

    each(type.fields, field => {
      field.id = `FIELD::${type.name}::${field.name}`;
      field.type = schema.types[field.type];
      each(field.args, arg => {
        arg.id = `ARGUMENT::${type.name}::${field.name}::${arg.name}`;
        arg.type = schema.types[arg.type];
      });
    });

    if (!isEmpty(type.possibleTypes)) {
      type.possibleTypes = map(type.possibleTypes, possibleType => ({
        id: `POSSIBLE_TYPE::${type.name}::${possibleType}`,
        type: schema.types[possibleType],
      }));
    }

    if (!isEmpty(type.derivedTypes)) {
      type.derivedTypes = map(type.derivedTypes, derivedType => ({
        id: `DERIVED_TYPE::${type.name}::${derivedType}`,
        type: schema.types[derivedType],
      }));
    }

    if (!isEmpty(type.interfaces)) {
      type.interfaces = map(type.interfaces, baseType => ({
        id: `INTERFACE::${type.name}::${baseType}`,
        type: schema.types[baseType],
      }));
    }
  });

  schema.types = keyBy(schema.types, 'id');
}
