import React from 'react';
import _map from 'lodash/map';

const TypeDefinition = ({name, fields}) => {

  return (
    <div className='col'>
      <h1>{name}</h1>
      <ul>
        {_map(fields, (value, key)=> <li key={key}>{key}</li> )}
      </ul>
    </div>
    )
}

class TextTypes extends React.Component {
  render() {
    const { simpleSchema } = this.props;
    if(!simpleSchema) return 'nothing'
    return (
    <div className='container'>
      <div className='row'>
      <TypeDefinition {...simpleSchema.queryType}/>
      <TypeDefinition {...simpleSchema.mutationType}/>
      </div>
    </div>);
  }
}

export default TextTypes;
