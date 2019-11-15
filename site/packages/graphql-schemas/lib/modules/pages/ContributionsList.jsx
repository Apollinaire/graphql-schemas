import React from 'react'
import { Components, registerComponent } from 'meteor/vulcan:core';
import Contributions from '../contributions';

const datatableFields = [
  'url',
  'query',
  'createdAt',
  'userId',
]

const ContributionsList = (props) => {
  return (
      <Components.Datatable collection={Contributions} columns={datatableFields} />      
  )
}

registerComponent({ name: 'ContributionsList', component: ContributionsList, hocs: [] });

export default ContributionsList
