import GraphQLDetector from './devtools/graphqlDetector';
import log from './lib/log/devtools';

log('UP');

let panelWindow; // this will be the panel window

const detector = new GraphQLDetector();

chrome.devtools.panels.create('GraphQL Schemas', '/icon-34.png', 'panel.html', (extensionPanel) => {
  extensionPanel.onShown.addListener(function tmp(pWindow) {
    extensionPanel.onShown.removeListener(tmp); // Run once only
    panelWindow = pWindow;
    detector.addOnSync(panelWindow.__GRAPQHL_EXTENSION__SYNC__)
  });
});
