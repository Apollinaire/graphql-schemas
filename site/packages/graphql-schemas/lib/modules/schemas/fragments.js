import gql from 'graphql-tag';

export const fullTypeFragment = gql`
  fragment fullTypeFragment on Type {
    name
    kind
    description
    fields {
      name
      type {
        name
        kind
      }
      description
      args {
        name
        type {
          name
          kind
        }
        description
      }
    }
  }
`;
// export const singleSchemaFragment = gql`
//   fragment singleSchema on Schema {
//     _id
//     slug
//     endpoint
//     queryType {
//       ...fullTypeFragment
//     }
//     mutationType {
//       ...fullTypeFragment
//     }
//     types {
//       ...fullTypeFragment
//     }
//   }
// `;
