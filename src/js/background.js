import '../img/icon-128.png'
import '../img/icon-34.png'
var openCount = 0;
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == "devtools-page") {
      if (openCount == 0) {
        alert("DevTools window opening.");
      }
      openCount++;

      port.onDisconnect.addListener(function(port) {
          openCount--;
          if (openCount == 0) {
            alert("Last DevTools window closing.");
          }
      });
    }
});