import GraphQLDetector from './devtools/graphqlDetector';
import log from './lib/log/devtools';

log('UP');
new GraphQLDetector();
chrome.devtools.panels.create('GraphQL Schemas', '', 'panel.html');
