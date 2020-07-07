const express = require('express');
const formidable = require('formidable');
const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/',(req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    file.path = __dirname + '/uploadfiletest/' + file.name
  })

  form.on('file',function (name, file) {
    console.log("uploaded file" + file.name);
  })

  res.send("Files Uploaded")
})

//server start
app.listen(app.get('port'),() => {
	console.log(`Escucho en el puerto  ${app.get('port')}`);
});
