const express = require('express');
const mongoose = require ('mongoose');
const formidable = require('formidable');
const md5 = require('js-md5');
const fs = require('fs')
const router = express.Router();
const app = express();


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
	.then(db => console.log('Db conectada'))
	.catch(err => console.log(err));

const fileprueba = require('./models/fileup');

// add reference to filemetadata
const filemetadata = require('./dbconn/file_metadata.js')
const chunkdata = require('./dbconn/chunk_data.js')


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/createFile', (req, res) => {
	// parse data from form
	let hashId = req.body.hashId
	let fileName = req.body.fileName
	let additionalMetadata = req.body.additionalMetadata || ''

	// try insert into db
	var values = filemetadata.create(hashId, fileName, additionalMetadata)
	let resCode = values[0]
	let resData = values[1]

	// set a response
	res.status(resCode).send(resData)
});

app.post('/saveChunk', (req, res) => {
	let hashId = req.body.hashId
	let position = req.body.position
	let chunk = req.body.chunk

	let buffer = str2ab(chunk)
	// get the checksum - already confirmed with other tools
	let checksum = md5(Buffer.from(buffer))

	// try insert into db
	var values = chunkdata.create(checksum, chunk)
	var resCode = values[0]
	var resData = values[1]

	if(resCode == 500) {
		res.status(resCode).send(resData)
		return
	}

	// try update the original file
	values = fileMetadata.update(hashId, checksum, position)
	resCode = values[0]
	resData = values[1]

	// set a response
	res.status(resCode).send(resData)
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
