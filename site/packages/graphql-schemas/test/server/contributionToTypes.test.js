import expect from 'expect';

import contributionToTypes, {
  arrayToObjectType,
  arrayToObjectTypes,
  mergeTypes,
  objectToArrayTypes,
  mergeNewType,
  objectToArrayType,
  isObjectType,
} from '../../lib/server/contributionToTypes';

const arrayType1 = {
  name: 'TestType1',
  fields: [
    {
      name: 'testField1-1',
      type: { kind: 'SCALAR', name: 'String' },
    },
    {
      name: 'testField1-2',
      type: { kind: 'OBJECT', name: 'TestType2' },
    },
    {
      name: 'testField1-3',
      type: { kind: 'OBJECT', name: 'testType3' },
    },
  ],
};

const arrayType2 = {
  name: 'TestType2',
  fields: [
    {
      name: 'testField2-1',
      type: { kind: 'SCALAR', name: 'String' },
    },
    {
      name: 'testField2-2',
      type: { kind: 'OBJECT', name: 'TestType2' },
    },
    {
      name: 'testField2-3',
      type: { kind: 'OBJECT', name: 'testType3' },
    },
  ],
};

const arrayType3 = {
  name: 'TestType3',
  fields: [
    {
      name: 'testField3-1',
      type: { kind: 'SCALAR', name: 'String' },
    },
    {
      name: 'testField3-2',
      type: { kind: 'OBJECT', name: 'TestType2' },
    },
    {
      name: 'testField3-3',
      type: { kind: 'OBJECT', name: 'testType3' },
    },
  ],
};

const objectType1 = {
  name: 'TestType1',
  fields: {
    'testField1-1': {
      name: 'testField1-1',
      type: { kind: 'SCALAR', name: 'String' },
    },
    'testField1-2': {
      name: 'testField1-2',
      type: { kind: 'OBJECT', name: 'TestType2' },
    },
    'testField1-3': {
      name: 'testField1-3',
      type: { kind: 'OBJECT', name: 'testType3' },
    },
  },
};

const objectType2 = {
  name: 'TestType2',
  fields: {
    'testField2-1': {
      name: 'testField2-1',
      type: { kind: 'SCALAR', name: 'String' },
    },
    'testField2-2': {
      name: 'testField2-2',
      type: { kind: 'OBJECT', name: 'TestType2' },
    },
    'testField2-3': {
      name: 'testField2-3',
      type: { kind: 'OBJECT', name: 'testType3' },
    },
  },
};

// const objectTypes = {
//   TestType1: objectType1,
//   TestType2: objectType2,
// }

describe('type transforming', () => {
  it('should transform array type to object type', () => {
    expect(arrayToObjectType(arrayType1)).toEqual(objectType1);
  });

  it('should transform object type to array type', () => {
    expect(objectToArrayType(objectType1)).toEqual(arrayType1);
  });

  it('should merge new unexisting type unchanged', () => {
    expect(mergeNewType({ TestType1: objectType1 }, arrayToObjectType(arrayType2))).toEqual({
      TestType1: objectType1,
      TestType2: objectType2,
    });
  });

  it('should identify object types', () => {
    expect(isObjectType(objectType1)).toEqual(true);
    expect(isObjectType(arrayType1)).toBe(false);
    expect(isObjectType({ name: 'TypeTest', fields: { field1: { name: 'field1' } } })).toBe(true);
    expect(isObjectType({ name: 'TypeTest', fields: { field1: { name: 'notField1' } } })).toBe(false);
  });

  it('should merge new known type in exisiting type', () => {
    const newTestField = { name: 'newTestField', type: { kind: 'foo', name: 'bar' } };
    expect(
      mergeNewType({ TestType1: objectType1, TestType2: objectType2 }, { name: 'TestType1', fields: { newTestField } })
    ).toEqual({
      TestType1: {
        name: 'TestType1',
        fields: {
          newTestField,
          'testField1-1': {
            name: 'testField1-1',
            type: { kind: 'SCALAR', name: 'String' },
          },
          'testField1-2': {
            name: 'testField1-2',
            type: { kind: 'OBJECT', name: 'TestType2' },
          },
          'testField1-3': {
            name: 'testField1-3',
            type: { kind: 'OBJECT', name: 'testType3' },
          },
        },
      },
      TestType2: objectType2,
    });
  });

  it('should merge new known type in existing type and merge existing field', () => {
    const newTestField = { name: 'testField1-1', type: { kind: 'foo', name: 'bar' } };
    expect(
      mergeNewType(
        { TestType1: objectType1, TestType2: objectType2 },
        { name: 'TestType1', fields: { 'testField1-1': newTestField } }
      )
    ).toEqual({
      TestType1: {
        name: 'TestType1',
        fields: {
          'testField1-1': {
            name: 'testField1-1',
            type: { kind: 'foo', name: 'bar' },
          },
          'testField1-2': {
            name: 'testField1-2',
            type: { kind: 'OBJECT', name: 'TestType2' },
          },
          'testField1-3': {
            name: 'testField1-3',
            type: { kind: 'OBJECT', name: 'testType3' },
          },
        },
      },
      TestType2: objectType2,
    });
  });
});
