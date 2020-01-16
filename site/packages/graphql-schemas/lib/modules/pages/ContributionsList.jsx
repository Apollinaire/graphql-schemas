import React from 'react';
import { Mutation } from 'react-apollo';

import { Components, registerComponent } from 'meteor/vulcan:core';
import Contributions from '../contributions';
import gql from 'graphql-tag';

const EVALUATE_CONTRIBUTION = gql`
  mutation evalutateContribution($id: String!) {
    evaluateContribution(id: $id)
  }
`;

const InlineMutator = ({ document }) => {
  return (
    <Mutation mutation={EVALUATE_CONTRIBUTION}>
      {evaluateContribution => (
        <Components.Button
          onClick={() => {
            evaluateContribution({ variables: { id: document._id } }).then(res => {
            });
          }}
        >
          Eval
        </Components.Button>
      )}
    </Mutation>
  );
};

const datatableFields = [
  {
    name: '_id',
    component: InlineMutator,
  },
  'url',
  'query',
  'createdAt',
  'userId',
];

const ContributionsList = props => {
  return (
    <>
      <Components.Datatable collection={Contributions} columns={datatableFields} />
    </>
  );
};

registerComponent({ name: 'ContributionsList', component: ContributionsList, hocs: [] });

export default ContributionsList;
