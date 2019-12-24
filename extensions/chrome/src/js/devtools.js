import GraphQLDetector from './devtools/graphqlDetector';

const g = new GraphQLDetector(true);

chrome.devtools.panels.create('GraphQL Schemas', null, 'panel.html');
