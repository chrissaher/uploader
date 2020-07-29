const express = require('express');
const mongoose = require('mongoose');
const formidable = require('formidable');
const md5 = require('js-md5');
const fs = require('fs')
const router = express.Router();
const app = express();
const jwtMiddleware = require('./public/jwtMiddleware.js')


app.use(express.static(__dirname + '/public'));

console.log("dirname: ", __dirname)
console.log("static: ", __dirname + '/public')

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb+srv://ayudinadm:REolfqEvHV8D3toF@ayudinfiles.pjgqg.mongodb.net/dbfiles?retryWrites=true&w=majority')
  .then(db => console.log('Db conectada'))
  .catch(err => console.log(err));

const fileprueba = require('./models/fileup');

// add reference to filemetadata
const filemetadataController = require('./dbconn/file_metadata.js')
const chunkdataController = require('./dbconn/chunk_data.js')

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Request-Headers, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.get('/', jwtMiddleware.confJWT, (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/createFile', jwtMiddleware.confJWT, (req, res) => {
  filemetadataController.create(req, res)
});

app.post('/saveChunk', jwtMiddleware.confJWT, async (req, res) => {
  filemetadataController.update(req, res);
});

app.get('/getList', jwtMiddleware.confJWT, (req, res) => {
  filemetadataController.findList(req, res);
})

app.post('/getFile', jwtMiddleware.confJWT, (req, res) => {
  filemetadataController.getByHashId(req, res);
})

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

//Routes
app.use(require('./router/users.js'));

//server start
app.listen(app.get('port'), () => {
  console.log(`Escucho en el puerto  ${app.get('port')}`);
});
