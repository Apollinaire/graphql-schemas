import log from './common/log/devtools';
import GraphQLDetector from './devtools/graphqlDetector';

new GraphQLDetector();
log("hola")
chrome.devtools.panels.create('GraphQL Schemas', '', 'panel.html');
