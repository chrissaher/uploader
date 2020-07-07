const express = require('express');
const mongoose = require ('mongoose');
const formidable = require('formidable');
const router = express.Router();
const app = express();
var datetime = new Date();

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
	.then(db => console.log('Db conectada'))
	.catch(err => console.log(err));

const fileprueba = require('./models/fileup');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/do-upload',  (req, res) => {
  var form = new formidable.IncomingForm();
  var fields = {};
  //form.parse(req);
  form.parse(req,  (err, fields, files) => {
    console.log('filename:',files.upload.name);
    console.log('uploaddate:',files.upload.lastModifiedDate);
    console.log('aditionalmetadata:',files);
    console.log('size:',files.upload.size);
  });


  form.on('fileBegin', function (name, file) {
    file.path = __dirname + '/uploadfiletest/' + file.name
  })

  res.send("Files Uploaded")
})

//server start
app.listen(app.get('port'),() => {
	console.log(`Escucho en el puerto  ${app.get('port')}`);
});
