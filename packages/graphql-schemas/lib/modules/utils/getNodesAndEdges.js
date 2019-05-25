import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';

export function getNodesAndEdges(introspection) {
  const nodes = introspection.__schema.types.reduce((memo, type) => {
    if (!isEmpty(type.fields) && type.name.slice(0, 2) !== '__') {
      return {
        ...memo,
        [type.name]: {...type, },
      };
    }
    return memo;
  }, {});

  const edges = [];
  forEach(nodes, (type, typeName) => {
    forEach(type.fields, (field, index) => {
      if (nodes.hasOwnProperty(field.type.name)) {
        edges.push([typeName, field.type.name, {label: '', style: 'color: white;'}])
      } else if (field.type.kind === 'LIST' && nodes.hasOwnProperty(field.type.ofType.name)) {
        edges.push([typeName, field.type.ofType.name, {label: 'LIST', }])
      }
    });
  });
  return { nodes, edges };
}
