const express = require('express');
const mongoose = require ('mongoose');
const formidable = require('formidable');
const router = express.Router();
const app = express();
var datetime = new Date();


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
	.then(db => console.log('Db conectada'))
	.catch(err => console.log(err));

const fileprueba = require('./models/fileup');

// add reference to filemetadata
const filemetadata = require('./dbconn/file_metadata.js')


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

//server start
app.listen(app.get('port'),() => {
	console.log(`Escucho en el puerto  ${app.get('port')}`);
});
