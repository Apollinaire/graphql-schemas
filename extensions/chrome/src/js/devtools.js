import GraphQLDetector from './devtools/graphqlDetector';

const g = new GraphQLDetector();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'graphql-detector') {
    g.linkPort(port);
  }
});

chrome.devtools.panels.create('GraphQL Schemas', null, 'panel.html');
