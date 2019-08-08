import React, { useState } from 'react';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _find from 'lodash/find';

const DocItem = ({ index, type, updateSelectedAt }) => {
  const fields = _filter(type.fields, field => field.type.kind === 'OBJECT' && field.type.name.slice(0, 2) !== '__');
  const leaves = _filter(type.fields, field => field.type.kind !== 'OBJECT' && field.type.name.slice(0, 2) !== '__');
  return (
    <div className='col'>
      <h4>{type.name}</h4>
      {_map(fields, field => (
        <a className='row' key={field.name} onClick={(e) => {e.stopPropagation();updateSelectedAt(index, field.type.name)}}>
          {field.name}
        </a>
      ))}
      {_map(leaves, field => (
        <div className='row' key={field.name}>{field.name}</div>
      ))}
    </div>
  );
};

const DocExplorer = ({ simpleSchema }) => {
  const [selected, setSelected] = useState([]);
  const types = _filter(simpleSchema.types, type => type.kind === 'OBJECT' && type.name.slice(0, 2) !== '__');
  const updateSelectedAt = (index, value) => {
    const remainingItems = selected.slice(0, index + 1);
    setSelected(remainingItems.concat([value]));
  };
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <h4>Types</h4>
          {_map(types, (type) => (
            <div
              className='row'
              key={type.name}
              onClick={() => {
                setSelected([type.name]);
              }}
            >
              {type.name}
            </div>
          ))}
        </div>
        {_map(selected, (typeName, index) => {
          const type = _find(simpleSchema.types, { name: typeName });
          return <DocItem type={type} key={type.name + index} index={index} updateSelectedAt={updateSelectedAt} />;
        })}
      </div>
    </div>
  );
};

export default DocExplorer;
