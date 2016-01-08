
// Call onDeviceReady when Cordova is loaded.
//
// At this point, the document has loaded but cordova-x.x.x.js has not.
// When Cordova is loaded and talking with the native device,
// it will call the event `deviceready`.
//
document.addEventListener("deviceready", init, false);
var lastStatus = "";

function init() {
  //listen for changes
  document.addEventListener("offline", offline, false);
  document.addEventListener("online", online, false);

}

function offline() {

}
function online() {

}
