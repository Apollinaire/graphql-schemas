import React, { useState } from 'react';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _keys from 'lodash/keys';
import _isEmpty from 'lodash/isEmpty';
import _compact from 'lodash/compact';

const Args = ({ args, updateSelectedAt, index, getTypeByName }) => {
  const [wrap, setWrap] = useState(true);

  const shouldWrap = args.length > 2;
  return (
    <span onClick={() => setWrap(!wrap)} style={{ cursor: wrap ? 'pointer' : 'auto' }}>
      (
      {shouldWrap && wrap
        ? '...'
        : _map(args, ({ name, type: originalType }, key) => {
            const type = getTypeByName(originalType?.name);
            return (
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
                {key < args.length - 1 && ', '}
              </span>
            );
          })}
      )
    </span>
  );
};

const DocField = ({ name, type: originalType, args = [], updateSelectedAt, index, getTypeByName, isListType }) => {
  const typeName = (originalType || {}).name || '';
  const type = getTypeByName(typeName);
  return (
    <div>
      {name}
      {!_isEmpty(args) ? (
        <Args args={args} updateSelectedAt={updateSelectedAt} index={index} getTypeByName={getTypeByName} />
      ) : null}
      {': '}
      {type.kind === 'OBJECT' ? (
        <>
          {isListType && '['}
          <a
            href=''
            onClick={e => {
              e.preventDefault();
              updateSelectedAt(index, type.name);
            }}
          >
            {type.name}
          </a>
          {isListType && ']'}
        </>
      ) : (
        <span>{type.name}</span>
      )}
    </div>
  );
};

const DocItem = ({ index, type = {}, updateSelectedAt, getTypeByName }) => {
  const fields = _filter(
    type.fields || [],
    field =>
      ((field || {}).type || {}).kind === 'OBJECT' && (((field || {}).type || {}).name || '').slice(0, 2) !== '__'
  );
  const leaves = _filter(
    type.fields || [],
    field =>
      (((field || {}).type || {}).kind || '') !== 'OBJECT' &&
      (((field || {}).type || {}).name || '').slice(0, 2) !== '__'
  );
  const inputFields = _filter(
    type.inputFields || [],
    field =>
      ((field || {}).type || []).kind === 'OBJECT' && (((field || {}).type || {}).name || '').slice(0, 2) !== '__'
  );
  const inputLeaves = _filter(
    type.inputFields || [],
    field =>
      ((field || {}).type || {}).kind !== 'OBJECT' && (((field || {}).type || {}).name || '').slice(0, 2) !== '__'
  );
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: '8px', paddingLeft: '8px' }}>
      <h4>{type.name}</h4>
      {type.description && <p>{type.description}</p>}
      {_map(fields, field => (
        <DocField
          key={field.name + 'field'}
          updateSelectedAt={updateSelectedAt}
          index={index}
          {...field}
          getTypeByName={getTypeByName}
        />
      ))}
      {_map(leaves, field => (
        <DocField
          key={field.name + 'leaf'}
          {...field}
          index={index}
          updateSelectedAt={updateSelectedAt}
          getTypeByName={getTypeByName}
        />
      ))}
      {_map(inputFields, field => (
        <DocField
          key={field.name + 'inputfield'}
          {...field}
          index={index}
          updateSelectedAt={updateSelectedAt}
          getTypeByName={getTypeByName}
        />
      ))}
      {_map(inputLeaves, field => (
        <DocField
          key={field.name + 'inputLeaf'}
          {...field}
          index={index}
          updateSelectedAt={updateSelectedAt}
          getTypeByName={getTypeByName}
        />
      ))}
    </div>
  );
};

const DocExplorer = ({ types = [], queryType = {}, mutationType = {} }) => {
  const [selected, setSelected] = useState([]);
  const objectTypes = _filter(types, type => type.kind === 'OBJECT' && type.name.slice(0, 2) !== '__');
  const updateSelectedAt = (index, value) => {
    const remainingItems = selected.slice(0, index + 1);
    setSelected(remainingItems.concat([value]));
  };
  const getTypeByName = name => {
    return _find(types, { name }) || { name };
  };
  return (
    <div style={{ width: '100%' }}>
      <div>
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <h4>Types</h4>
          {_map(objectTypes, type => (
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
          const type = _find(_compact(types), { name: typeName });
          if (!type) return null;
          return (
            <DocItem
              type={type}
              key={type.name + index}
              index={index}
              updateSelectedAt={updateSelectedAt}
              getTypeByName={getTypeByName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DocExplorer;
