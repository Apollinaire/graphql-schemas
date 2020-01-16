import expect from 'expect';

import contributionToTypes, {
  arrayToObjectType,
  arrayToObjectTypes,
  mergeTypes,
  objectToArrayTypes,
  mergeNewType,
  objectToArrayType,
} from '../../lib/server/contributionToTypes';

describe('type merging and transforming', () => {
  it('should transform array to object types', () => {
    const type = {
      name: 'TestType',
      fields: [
        {
          name: 'testField1',
          type: { kind: 'SCALAR', name: 'String' },
        },
        {
          name: 'testField2',
          type: { kind: 'OBJECT', name: 'TestType2' },
        },
        {
          name: 'testField3',
          type: { kind: 'OBJECT', name: 'testType3' },
        },
      ],
    };
    const expectedType = {
      name: 'TestType',
      fields: {
        testField1: {
          name: 'testField1',
          type: { kind: 'SCALAR', name: 'String' },
        },
        testField2: {
          name: 'testField2',
          type: { kind: 'OBJECT', name: 'TestType2' },
        },
        testField3: {
          name: 'testField3',
          type: { kind: 'OBJECT', name: 'testType3' },
        },
      },
    };
    expect(arrayToObjectType(type)).toEqual(expectedType);
  });
});
