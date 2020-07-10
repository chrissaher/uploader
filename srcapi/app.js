const express = require('express');
const mongoose = require ('mongoose');
const formidable = require('formidable');
const md5 = require('js-md5');
const fs = require('fs')
const router = express.Router();
const app = express();


app.use(express.static(__dirname + '/public'));

console.log("dirname: ", __dirname)
console.log("static: ", __dirname + '/public')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
	.then(db => console.log('Db conectada'))
	.catch(err => console.log(err));

const fileprueba = require('./models/fileup');

// add reference to filemetadata
const filemetadataController = require('./dbconn/file_metadata.js')
const chunkdataController = require('./dbconn/chunk_data.js')


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/createFile', (req, res) => {
	filemetadataController.create(req,res)
});

app.post('/saveChunk', async (req, res) => {
	filemetadataController.update(req, res);
});

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

app.get('/getList', async (req, res) =>{
	const fileList = await filemetadata.findList();
	res.json(fileList);
})

//server start
app.listen(app.get('port'),() => {
	console.log(`Escucho en el puerto  ${app.get('port')}`);
});
