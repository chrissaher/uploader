// common functions for client and server side


// Working with ArrayBuffer
// Source: https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf); // Original code is Uint16Array
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  // return String.fromCharCode.apply(null, new Uint8Array(buf));
  var bufView = new Uint8Array(buf)
  return bufView.reduce((acc, i) => acc += String.fromCharCode.apply(null, [i]), '');
}

/* Example of how to save a string containg the array buffer*/
// chunk comes in request. Type: String
// Tested with one image (filetype: png)
var buffer = str2ab(chunk)
fs.appendFile('./image.png', Buffer.from(buffer), function (err) {
  if (err) {
    console.log("error")
  }
});
