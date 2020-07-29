const md5 = require('js-md5');
const fs = require('fs')

// include related entities
const FileMetadata = require("../models/file_metadata")
const ChunkData = require("../models/chunk_data.js")

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
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

function appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
};

exports.create = (req, res) => {
  let hashId = req.body.fileHashId
  let fileName = req.body.fileName
  let additionalMetadata = JSON.stringify(req.body.additionalMetadata || '')
  let currentDate = Date.now();
  let empty = ''

  // create object to be inserted
  const fileMetadata = new FileMetadata({
    hashId: hashId,
    fileName: fileName,
    uploadDate: currentDate,
    additionalMetadata: additionalMetadata,
    part1: empty,
    part2: empty,
    part3: empty,
    part4: empty,
    part5: empty,
    userId: req.user.id
  });
  fileMetadata.save()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log("error here: ", err)
      res.status(500).send("error inserting metadata")
    })
};

exports.update = (req, res) => {
  let hashId = req.body.fileHashId
  let position = req.body.position
  let chunk = req.body.chunk
  let buffer = str2ab(chunk)
  let chunkId = md5(Buffer.from(buffer))

  // First we insert the new chunk
  const chunkData = new ChunkData({
    chunkId: chunkId,
    chunkContent: chunk,
  });

  chunkData.save()
    .then(data => {
      var query = FileMetadata.find({hashId: hashId})
      query.exec(function(err, docs) {
        if(err) {
          console.log("error at find");
          res.status(500).send("error at find")
        }
        var filemetadata = docs[0];
        var id = filemetadata["_id"];
        var updateField;
        switch(position) {
          case 1: updateField={part1:chunkId};break;
          case 2: updateField={part2:chunkId};break;
          case 3: updateField={part3:chunkId};break;
          case 4: updateField={part4:chunkId};break;
          case 5: updateField={part5:chunkId};break;
        }
        FileMetadata.findByIdAndUpdate({_id: id},updateField, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(500).send("error on update");
          } else {
            res.send("updated correctly");
          }
        })
        .catch(err => {
          res.status(500).send("error at update")
        })
      });

    })
    .catch(err => {
      res.status(500).send("unexpected at update")
    })
};

exports.findList = (req, res) => {
  FileMetadata.find({userId: req.user.id})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.status(500).send("error at listing files")
    })
};

exports.getByHashId = async (req, res) => {
  let hashId = req.body.fileHashId
  var filequery = FileMetadata.find({hashId: hashId})
  filequery.exec(function(err, docs) {
    if(err) {
      console.log("error at find with hashId: ", hashId)
      res.status(500).send("error at find")
    }
    var filemetadata = docs[0]
    let filename = filemetadata['fileName']
    let chunks = [filemetadata['part1'],
                  filemetadata['part2'],
                  filemetadata['part3'],
                  filemetadata['part4'],
                  filemetadata['part5']]

    ChunkData.find({chunkId: chunks})
    .then(data => {
        let len = data.length
        var ids = [null, null, null, null, null]
        var buffers = [null, null, null, null, null]
        for(var i = 0; i < len; ++i ) {
            let chunkid = data[i]["chunkId"]
            let chunkdata = str2ab(data[i]["chunkContent"])
            let index = chunks.indexOf(chunkid)
            ids[index] = chunkid
            buffers[index] = chunkdata
        }
        var fileBuffer = buffers[0];
        for(var i = 1; i < len; ++i) fileBuffer = appendBuffer(fileBuffer, buffers[i]);
        res.send(ab2str(fileBuffer))
    })
    .catch(err => {
        res.status(500).send("error chunk query")
    })
  })
};
