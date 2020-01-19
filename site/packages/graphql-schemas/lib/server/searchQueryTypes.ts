import _ from 'underscore';
import {
  parse,
  DefinitionNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  SelectionNode,
  FieldNode,
  ArgumentNode,
  ValueNode,
  VariableDefinitionNode,
  TypeNode,
  SelectionSetNode,
} from 'graphql';
import { mergeTypes, ObjectTypes, ObjectField, Arg } from './contributionToTypes';

const searchQueryTypes = (query: string): ObjectTypes => {
  let types = {};
  try {
    const docAST = parse(query, { noLocation: true });

    _.each(docAST.definitions, (definition: DefinitionNode) => {
      if (definitionIsOperation(definition)) {
        types = mergeTypes(types, searchOperationTypes(definition));
      } else if (definitionIsFragment(definition)) {
        types = mergeTypes(types, searchFragmentTypes(definition));
      }
    });
  } catch (error) {
    throw error;
  }
  return types;
};

const definitionIsOperation = (definition: DefinitionNode): definition is OperationDefinitionNode => {
  return definition.kind === 'OperationDefinition';
};

const definitionIsFragment = (definition: DefinitionNode): definition is FragmentDefinitionNode => {
  return definition.kind === 'FragmentDefinition';
};

const searchOperationTypes = (definition: OperationDefinitionNode): ObjectTypes => {
  let types = {};
  const context = searchVariableTypes(definition.variableDefinitions);

  const selectionFields = getFieldsFromSelectionSet(definition.selectionSet, context);

  switch (definition.operation) {
    case 'query':
      types = mergeTypes(types, { Query: { name: 'Query', kind: 'OBJECT', fields: selectionFields } });
      break;
    case 'mutation':
      types = mergeTypes(types, { Mutation: { name: 'Mutation', kind: 'OBJECT', fields: selectionFields } });
      break;
    case 'subscription': // TODO later
      break;

    default:
      break;
  }
  return types;
};

export const searchFragmentTypes = (definition: FragmentDefinitionNode): ObjectTypes => {
  const fields = getFieldsFromSelectionSet(definition.selectionSet, {});
  return {
    [definition.typeCondition.name.value]: {
      name: definition.typeCondition.name.value,
      kind: 'OBJECT',
      fields,
    },
  };
};

export const getFieldsFromSelectionSet = (
  selectionSet: SelectionSetNode,
  context: ArgumentContext
): { [key: string]: ObjectField } => {
  return _.object(
    _.compact(
      _.map(selectionSet.selections, selection => {
        if (selectionIsField(selection)) {
          return [selection.name.value, getObjectFieldFromFieldNode(selection, context)];
        }
      })
    )
  );
};

interface ArgumentContext {
  [key: string]: {
    name: string;
  };
}

const searchVariableTypes = (variableDefinitions: readonly VariableDefinitionNode[] = []): ArgumentContext => {
  let result: ArgumentContext = {};
  _.each(variableDefinitions, varDef => {
    result[varDef.variable.name.value] = getRecursiveArgType(varDef.type);
  });
  return result;
};

const getRecursiveArgType = (type: TypeNode, context: any = {}): Arg => {
  switch (type.kind) {
    case 'NamedType':
      return { ...context, name: type.name.value } as Arg;
    case 'ListType':
      return getRecursiveArgType(type.type, { ...context, isListType: true });
    case 'NonNullType':
      return getRecursiveArgType(type.type);
  }
};

const selectionIsField = (selection: SelectionNode): selection is FieldNode => {
  return selection?.kind === 'Field';
};

const getObjectFieldFromFieldNode = (selection: FieldNode, context: ArgumentContext): ObjectField => {
  const args = selection.arguments ? getArgsFromSelectionField(selection.arguments, context) : null;
  return {
    name: selection.name.value,
    ...(args && { args }),
  };
};

const getArgsFromSelectionField = (args: readonly ArgumentNode[], context: ArgumentContext): { [key: string]: Arg } => {
  return _.object(
    _.compact(
      _.map(args, arg =>
        arg?.name?.value ? [arg.name.value, getArgumentFromValueNode(arg.value, arg.name.value, context)] : null
      )
    )
  );
};

const getArgumentFromValueNode = (value: ValueNode, name: string, context: ArgumentContext): Arg => {
  let type;
  switch (value.kind) {
    case 'Variable':
      type = context[value.name.value];
      break;
    case 'StringValue':
      // this is where we convert from the value that was cleared by the extension during `cleanQuery`
      type = getArgTypeFromStringValue(value.value);
      break;
    case 'ObjectValue': // TODO
    case 'ListValue': // TODO
    default:
      break;
  }
  return {
    name,
    type,
  };
};

const getArgTypeFromStringValue = (value: string): { kind: string; name: string } | undefined => {
  switch (value) {
    case 'StringValue':
      return { kind: 'SCALAR', name: 'String' };
    case 'IntValue':
      return { kind: 'SCALAR', name: 'Int' };
    case 'FloatValue':
      return { kind: 'SCALAR', name: 'Float' };
    case 'BooleanValue':
      return { kind: 'SCALAR', name: 'Boolean' };
    case 'EnumValue':
      return { kind: 'SCALAR', name: 'Enum' };
    default:
      return;
  }
};

export default searchQueryTypes;
