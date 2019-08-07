import React from 'react';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';

const TypeDefinition = ({ name, fields }) => {
  return (
    <div className='col'>
      <h1>{name}</h1>
      <ul>
        {_map(fields, (value, key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </div>
  );
};

const iteratees = [
  v => (v.name === 'Query' ? 1 : v.name === 'Mutation' ? 2 : 3),
  v => v.name.charAt(0) === '_' ? 1 : 0,
  'kind',
  'name',
];

const orders = [
  'asc', 'asc', 'desc', 'desc'
]

class TextTypes extends React.PureComponent {
  render() {
    const { simpleSchema } = this.props;
    if (!simpleSchema) return 'nothing';
    const types = _orderBy(simpleSchema.types, iteratees, orders);
    return (
      <div>
        <div className='row'>
          {/* <TypeDefinition {...simpleSchema.queryType} />
          <TypeDefinition {...simpleSchema.mutationType} /> */}
          {_.map(types, type => (
            <TypeDefinition key={type.name} {...type} />
          ))}
        </div>
      </div>
    );
  }
}

export default TextTypes;
