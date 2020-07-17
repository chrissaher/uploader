function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers
    };
}
const express = require('express');
const mongoose = require ('mongoose');
const formidable = require('formidable');
const md5 = require('js-md5');
const fs = require('fs')
const router = express.Router();
const app = express();
const bunyan = require('bunyan');
// var log = bunyan.createLogger({name: "uploader"});
var log = bunyan.createLogger({
    name: "uploader",                     // Required
    level: "info",                        // Optional
    streams: [
			{
				level: 'info',
				stream: process.stdout            // From info and above will be displayed in stdout
			},
			{
				level: 'error',
				path: 'error.log'                // From error and above will be written into error.log file
			}
		],
		serializers: {
        req: reqSerializer              // Serializer for req argument
    }
});
log.info("default: ", log.levels())
log.info("This is a info log message")    // Will be displayed
log.debug("This is a debug log message")  // Will not be displayed
log.warn("This is a warn log message")    // Will be displayed
app.use(express.static(__dirname + '/public'));

log.info("dirname: ", __dirname)
log.info("static: ", __dirname + '/public')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
	.then(db => log.debug('Db conectada'))
	.catch(err => log.error("err"));

log.error("error try")

const fileprueba = require('./models/fileup');

// add reference to filemetadata
const filemetadataController = require('./dbconn/file_metadata.js')
const chunkdataController = require('./dbconn/chunk_data.js')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.get('/', (req, res) => {
	log.info({req: req}, "Incomming request")
  res.sendFile(__dirname + '/index.html');
})

app.post('/createFile', (req, res) => {
	filemetadataController.create(req,res)
});

app.post('/saveChunk', async (req, res) => {
	filemetadataController.update(req, res);
});

app.get('/getList', (req, res) =>{
	filemetadataController.findList(req, res);
})

app.post('/getFile', (req, res) =>{
	filemetadataController.getByHashId(req, res);
})

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

//server start
app.listen(app.get('port'),() => {
	console.log(`Escucho en el puerto  ${app.get('port')}`);
});
