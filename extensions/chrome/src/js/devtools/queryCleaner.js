import _ from 'underscore';
import { parse, print } from 'graphql';

const replaceArgumentValues = argument => {
  switch (argument.kind) {
    case 'StringValue':
      return {
        ...argument,
        kind: 'StringValue',
        value: 'StringValue',
      };
    case 'IntValue':
      return {
        ...argument,
        kind: 'StringValue',
        value: 'IntValue',
      };
    case 'FloatValue':
      return {
        ...argument,
        kind: 'StringValue',
        value: 'FloatValue',
      };
    case 'BooleanValue':
      return {
        ...argument,
        kind: 'StringValue',
        value: 'BooleanValue',
      };
    case 'NullValue':
      return argument;
    case 'EnumValue':
      return argument;
    case 'ListValue':
      return {
        ...argument,
        values: _.map(argument.values, replaceArgumentValues),
      };
    case 'ObjectValue':
      return {
        ...argument,
        value: '',
      };
    case 'ObjectField':
      return {
        ...argument,
        value: replaceArgumentValues(argument.value),
      };
    case 'Variable':
      return argument;

    default:
      break;
  }
};

const getAstWithoutArguments = ast => {
  switch (ast.kind) {
    case 'Document':
      return { ...ast, definitions: _.map(ast.definitions, getAstWithoutArguments) };
    case 'OperationDefinition':
    case 'FragmentDefinition':
      return {
        ...ast,
        selectionSet: getAstWithoutArguments(ast.selectionSet),
        variableDefinitions: _.map(ast.variableDefinitions, getAstWithoutArguments),
        directives: _.map(ast.directives, getAstWithoutArguments),
      };

    case 'SelectionSet':
      return { ...ast, selections: _.map(ast.selections, getAstWithoutArguments) };
    case 'Field':
      return {
        ...ast,
        arguments: _.map(ast.arguments, getAstWithoutArguments),
        selections: _.map(ast.selections, getAstWithoutArguments),
      };
    case 'Directive':
      return {
        ...ast,
        arguments: _.map(ast.arguments, getAstWithoutArguments),
      };
    case 'Argument':
      return {
        ...ast,
        value: replaceArgumentValues(ast.value),
      };
    default:
      return ast;
  }
};

const queryCleaner = query => {
  const documentAST = parse(query);
  return print(getAstWithoutArguments(documentAST));
};

export default queryCleaner;
