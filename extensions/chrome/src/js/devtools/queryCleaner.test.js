import queryCleaner from './queryCleaner';
import { parse, print } from 'graphql';

describe('QueryCleaner', () => {
  test('should clean argument values', () => {
    const query = /* GraphQL */ `
      query testArgumentValues {
        user(id: "azerty") {
          id
          email
        }
      }
    `;
    const expectedResult = /* GraphQL */ `
      query testArgumentValues {
        user(id: "StringValue") {
          id
          email
        }
      }
    `;
    expect(queryCleaner(query)).toEqual(print(parse(expectedResult)));
  });
});
