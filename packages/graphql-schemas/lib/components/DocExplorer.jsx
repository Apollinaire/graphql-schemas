import React, { useState } from 'react';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _keys from 'lodash/keys';
import _isEmpty from 'lodash/isEmpty';

const Args = ({ args, updateSelectedAt, index }) => {
  const [wrap, setWrap] = useState(true);
  const lastKey = _last(_keys(args));
  const shouldWrap = _keys(args).length > 2;
  return (
    <span onClick={() => setWrap(!wrap)} style={{cursor: wrap ? 'pointer' : 'auto'}}>
      (
      {shouldWrap && wrap
        ? '...'
        : _map(args, ({ name, type }, key) => (
            <span key={name}>
              {name + ': '}
              {type.kind === 'OBJECT' || type.kind === 'INPUT_OBJECT' ? (
                <a
                  href=''
                  onClick={e => {
                    e.preventDefault();
                    updateSelectedAt(index, type.name);
                  }}
                >
                  {type.name}
                </a>
              ) : (
                <span>{type.name}</span>
              )}
              {key !== lastKey && ', '}
            </span>
          ))}
      )
    </span>
  );
};
const DocField = ({ name, type, args, updateSelectedAt, index }) => {
  return (
    <div key={name}>
      {name}
      {!_isEmpty(args) ? <Args args={args} updateSelectedAt={updateSelectedAt} index={index} /> : null}
      {': '}
      {type.kind === 'OBJECT' ? (
        <a
          href=''
          onClick={e => {
            e.preventDefault();
            updateSelectedAt(index, type.name);
          }}
        >
          {type.name}
        </a>
      ) : (
        <span>{type.name}</span>
      )}
    </div>
  );
};

const DocItem = ({ index, type, updateSelectedAt }) => {
  const fields = _filter(type.fields, field => field.type.kind === 'OBJECT' && field.type.name.slice(0, 2) !== '__');
  const leaves = _filter(type.fields, field => field.type.kind !== 'OBJECT' && field.type.name.slice(0, 2) !== '__');
  const inputFields = _filter(
    type.inputFields,
    field => field.type.kind === 'OBJECT' && field.type.name.slice(0, 2) !== '__'
  );
  const inputLeaves = _filter(
    type.inputFields,
    field => field.type.kind !== 'OBJECT' && field.type.name.slice(0, 2) !== '__'
  );
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: '8px', paddingLeft: '8px' }}>
      <h4>{type.name}</h4>
      {type.description && <p>{type.description}</p>}
      {_map(fields, field => (
        <DocField key={field.name} updateSelectedAt={updateSelectedAt} index={index} {...field} />
      ))}
      {_map(leaves, field => (
        <DocField key={field.name} {...field} index={index} updateSelectedAt={updateSelectedAt} />
      ))}
      {_map(inputFields, field => (
        <DocField key={field.name} {...field} index={index} updateSelectedAt={updateSelectedAt} />
      ))}
      {_map(inputLeaves, field => (
        <DocField key={field.name} {...field} index={index} updateSelectedAt={updateSelectedAt} />
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
    <div style={{ width: '100%' }}>
      <div>
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <h4>Types</h4>
          {_map(types, type => (
            <div key={type.name}>
              <a
                href=''
                onClick={e => {
                  e.preventDefault();
                  setSelected([type.name]);
                }}
              >
                {type.name}
              </a>
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
