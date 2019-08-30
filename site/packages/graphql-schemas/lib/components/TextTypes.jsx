import React from 'react';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';

const TypeDefinition = ({ name, fields, inputFields, possibleTypes, enumValues }) => {
  return (
    <div className='col'>
      <h1>{name}</h1>
      <ul>
        {_map(fields, (value, key) => (
          <li key={key}>
            {key}: {value.type.name}
          </li>
        ))}
        {_map(inputFields, (value, key) => (
          <li key={key}>
            {key}: {value.type.name}
          </li>
        ))}
        {_map(possibleTypes, (value, key) => (
          <li key={key}>
            {key}: {value.type.name}
          </li>
        ))}
        {_map(enumValues, (value, key) => (
          <li key={key}>
            {key}: {value.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const kindMap = {
  OBJECT: 10,
  LIST: 20,
  INTERFACE: 30,
  UNION: 40,
  NON_NULL: 50,
  INPUT_OBJECT: 60,
  ENUM: 70,
  SCALAR: 80,
};

const iteratees = [
  v => (v.name === 'Query' ? 1 : v.name === 'Mutation' ? 2 : 3),
  v => (v.name.charAt(0) === '_' ? 1 : 0),
  ({ kind }) => kindMap[kind] || 100,
  'name',
];

class TextTypes extends React.PureComponent {
  render() {
    const { simpleSchema } = this.props;
    if (!simpleSchema) return 'nothing';
    const types = _orderBy(simpleSchema.types, iteratees);
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
