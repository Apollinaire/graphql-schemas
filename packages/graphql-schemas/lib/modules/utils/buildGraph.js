import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import values from 'lodash/values';
import _ from 'lodash/core';

import { typeNameToId, isScalarType, isInputObjectType, isSystemType } from './introspection';

export function isNode(type) {
  return !(isScalarType(type) || isInputObjectType(type) || isSystemType(type) || type.isRelayType);
}

export function getDefaultRoot(schema) {
  return schema.queryType.name;
}

export function getTypeGraph(schema, rootType, hideRoot) {
  if (schema === null) return null;

  const rootId = typeNameToId(rootType || getDefaultRoot(schema));
  return buildGraph(rootId);

  function getEdgeTargets(type) {
    return _([...values(type.fields), ...(type.derivedTypes || []), ...(type.possibleTypes || [])])
      .map('type')
      .filter(isNode)
      .map('id')
      .value();
  }

  function buildGraph(rootId) {
    var typeIds = [rootId];
    var nodes = [];
    var types = keyBy(schema.types, 'id');

    for (var i = 0; i < typeIds.length; ++i) {
      var id = typeIds[i];
      if (typeIds.indexOf(id) < i) continue;

      var type = types[id];

      nodes.push(type);
      typeIds.push(...getEdgeTargets(type));
    }
    return {
      rootId,
      nodes: hideRoot ? omit(keyBy(nodes, 'id'), [rootId]) : keyBy(nodes, 'id'),
    };
  }
}
