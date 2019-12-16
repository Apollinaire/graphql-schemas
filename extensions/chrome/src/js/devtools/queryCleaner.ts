import _ from 'underscore';
import {
  parse,
  print,
  DocumentNode,
  ValueNode,
  ObjectFieldNode,
  ExecutableDefinitionNode,
  SelectionSetNode,
  SelectionNode,
  DirectiveNode,
  ArgumentNode,
  VariableDefinitionNode,
} from 'graphql';

const replaceObjectFieldValues = (objectField: ObjectFieldNode): ObjectFieldNode => {
  return {
    ...objectField,
    value: replaceValue(objectField.value),
  };
};

const replaceValue = (argument: ValueNode): ValueNode => {
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
    case 'EnumValue':
      return {
        ...argument,
        kind: 'StringValue',
        value: 'EnumValue'
      };
    case 'NullValue':
      return argument;
    case 'ListValue':
      return {
        ...argument,
        kind: 'ListValue',
        values: _.map(argument.values, replaceValue),
      };
    case 'ObjectValue':
      return {
        ...argument,
        fields: _.map(argument.fields, replaceObjectFieldValues),
      };
    case 'Variable':
      return argument;
    default:
      return argument;
  }
};

const getArgumentWithoutValues = (argument: ArgumentNode): ArgumentNode => {
  return {
    ...argument,
    value: replaceValue(argument.value),
  };
};

const getDirectiveWithoutArguments = (directive: DirectiveNode): DirectiveNode => {
  return {
    ...directive,
    arguments: _.map(_.compact(directive.arguments), getArgumentWithoutValues),
  };
};

const getDirectivesWithoutValues = (
  directives: ReadonlyArray<DirectiveNode> | undefined
): ReadonlyArray<DirectiveNode> | undefined => {
  return _.map(_.compact(directives), getDirectiveWithoutArguments);
};

const getSelectionWithoutValues = (selection: SelectionNode): SelectionNode => {
  switch (selection.kind) {
    case 'Field':
      return {
        ...selection,
        directives: getDirectivesWithoutValues(selection.directives),
        arguments: _.map(_.compact(selection.arguments), getArgumentWithoutValues),
        selectionSet: selection.selectionSet ? getSelectionSetWithoutValues(selection.selectionSet) : undefined,
      };
    case 'FragmentSpread':
      return {
        ...selection,
        directives: getDirectivesWithoutValues(selection.directives),
      };
    case 'InlineFragment':
      return {
        ...selection,
        directives: getDirectivesWithoutValues(selection.directives),
        selectionSet: getSelectionSetWithoutValues(selection.selectionSet),
      };
    default:
      return selection;
  }
};

const getSelectionSetWithoutValues = (selectionSet: SelectionSetNode): SelectionSetNode => {
  return {
    ...selectionSet,
    selections: _.map(selectionSet.selections, getSelectionWithoutValues),
  };
};

const getVariableDefinitionsWithoutValues = (
  variableDefinitions: ReadonlyArray<VariableDefinitionNode>
): ReadonlyArray<VariableDefinitionNode> => {
  return _.map(_.compact(variableDefinitions), variableDefinition => ({
    ...variableDefinition,
    directives: getDirectivesWithoutValues(variableDefinition.directives),
    defaultValue: variableDefinition.defaultValue && replaceValue(variableDefinition.defaultValue),
  }));
};

const getDefinitionWithoutValues = (definition: ExecutableDefinitionNode): ExecutableDefinitionNode => {
  return {
    ...definition,
    selectionSet: getSelectionSetWithoutValues(definition.selectionSet),
    variableDefinitions:
      definition.variableDefinitions && getVariableDefinitionsWithoutValues(definition.variableDefinitions),
    directives: getDirectivesWithoutValues(definition.directives),
  };
};

const getDocumentWithoutValues = (ast: DocumentNode): DocumentNode => {
  return { ...ast, definitions: _.map(ast.definitions as ExecutableDefinitionNode[], getDefinitionWithoutValues) };
};

const queryCleaner = (query: string): string => {
  const documentAST = parse(query);
  return print(getDocumentWithoutValues(documentAST));
};

export default queryCleaner;
