// todo: start here the GraphQL Detector
// import GraphQLDetector from "./devtools/graphqlDetector";

chrome.devtools.panels.create("GraphQL Schemas", null, "panel.html");

// setInterval(() => {

//   console.log('sending message in devtools')
//   chrome.runtime.sendMessage({ from: "devtools" }, response => {
//     if(response === undefined) {
//       console.log('error', chrome.runtime.lastError)
//     }
//     else {
//       console.log("response received in devtools: ", response)

//     }
//   }
//   );
// }, 10000);
