import queryCleaner from './queryCleaner';
import { parse, print } from 'graphql';

describe('QueryCleaner', () => {
  const values = `[{ shouldBeFloat: 1.12 }, 1, "abcd", true, null, AZERTY]`;
  const expectedValues = `[{ shouldBeFloat: "FloatValue" }, "IntValue", "StringValue", "BooleanValue", null, "EnumValue"]`
  test('should clean inline argument values', () => {
    const query = /* GraphQL */ `
      query testArgumentValues {
        user(arg: ${values} ) {
          id
          email
        }
      }
    `;
    const expectedResult = /* GraphQL */ `
      query testArgumentValues {
        user(arg: ${expectedValues}) {
          id
          email
        }
      }
    `;
    expect(queryCleaner(query)).toEqual(print(parse(expectedResult)));
  });
  test('should clean directive values', () => {
    const query = /* GraphQL */ `
      query testArgumentValues {
        user {
          id @testdirective(arg: ${values})
          email
        }
      }
    `;
    const expectedResult = /* GraphQL */ `
      query testArgumentValues {
        user {
          id @testdirective(arg: ${expectedValues})
          email
        }
      }
    `;
    expect(queryCleaner(query)).toEqual(print(parse(expectedResult)));
  });
});
