import '../img/icon-128.png';
import '../img/icon-34.png';
import log from './common/log/background';

var openCount = 0;
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == 'devtools-page') {
    if (openCount == 0) {
      log('DevTools window opening.');
    }
    openCount++;

    port.onDisconnect.addListener(function (port) {
      openCount--;
      if (openCount == 0) {
        log('Last DevTools window closing.');
      }
    });
  }
});
log('hola :)')