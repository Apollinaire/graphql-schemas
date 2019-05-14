import startsWith from 'lodash/startsWith';
import get from 'lodash/get';
import _ from 'lodash';

export function buildId(...parts) {
  return parts.join('::');
}

export function typeNameToId(name) {
  return buildId('TYPE', name);
}

export function isSystemType(type) {
  return startsWith(type.name, '__');
}

export function isBuiltInScalarType(type) {
  return ['Int', 'Float', 'String', 'Boolean', 'ID'].indexOf(type.name) !== -1;
}

export function isScalarType(type) {
  return type.kind === 'SCALAR' || type.kind === 'ENUM';
}

export function isObjectType(type) {
  return type.kind === 'OBJECT';
}

export function isInputObjectType(type) {
  return type.kind === 'INPUT_OBJECT';
}

export function unwrapType(type, wrappers) {
  while (type.kind === 'NON_NULL' || type.kind == 'LIST') {
    wrappers.push(type.kind);
    type = type.ofType;
  }
  return type.name;
}

export function convertArg(inArg) {
  var outArg = {
    name: inArg.name,
    description: inArg.description,
    defaultValue: inArg.defaultValue,
    typeWrappers: [],
  };
  outArg.type = unwrapType(inArg.type, outArg.typeWrappers);

  return outArg;
}

let convertInputField = convertArg;

export function convertField(inField) {
  var outField = {
    name: inField.name,
    description: inField.description,
    typeWrappers: [],
    isDeprecated: inField.isDeprecated,
  };

  outField.type = unwrapType(inField.type, outField.typeWrappers);

  outField.args = _(inField.args)
    .map(convertArg)
    .keyBy('name')
    .value();

  if (outField.isDeprecated) outField.deprecationReason = inField.deprecationReason;

  return outField;
}

export function convertType(inType) {
  const outType = {
    kind: inType.kind,
    name: inType.name,
    description: inType.description,
  };

  switch (inType.kind) {
    case 'OBJECT':
      outType.interfaces = _(inType.interfaces)
        .map('name')
        .uniq()
        .value();
      outType.fields = _(inType.fields)
        .map(convertField)
        .keyBy('name')
        .value();
      break;
    case 'INTERFACE':
      outType.derivedTypes = _(inType.possibleTypes)
        .map('name')
        .uniq()
        .value();
      outType.fields = _(inType.fields)
        .map(convertField)
        .keyBy('name')
        .value();
      break;
    case 'UNION':
      outType.possibleTypes = _(inType.possibleTypes)
        .map('name')
        .uniq()
        .value();
      break;
    case 'ENUM':
      outType.enumValues = inType.enumValues.slice();
      break;
    case 'INPUT_OBJECT':
      outType.inputFields = _(inType.inputFields)
        .map(convertInputField)
        .keyBy('name')
        .value();
      break;
  }

  return outType;
}

export function simplifySchema(inSchema) {
  return {
    types: _(inSchema.types)
      .map(convertType)
      .keyBy('name')
      .value(),
    queryType: inSchema.queryType.name,
    mutationType: get(inSchema, 'mutationType.name', null),
    subscriptionType: get(inSchema, 'subscriptionType.name', null),
    //FIXME:
    //directives:
  };
}
