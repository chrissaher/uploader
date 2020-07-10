const md5 = require('js-md5');

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

exports.create = (req, res) => {
  let hashId = req.body.fileHashId
	let fileName = req.body.fileName
	let additionalMetadata = req.body.additionalMetadata || ''
  let currentDate = Date.now();

  // create object to be inserted
  const fileMetadata = new FileMetadata({
    hashId: hashId,
    fileName: fileName,
    uploadDate: currentDate,
    additionalMetadata: additionalMetadata
  });
  fileMetadata.save()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
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
        var part = `part${position}`
        FileMetadata.findByIdAndUpdate({_id: id},{part: chunkId}, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(500).send("error on update");
          } else res.send("updated correctly");
        })
        .catch(err => {
          console.log("error at update");
          console.log("err: ", err)
          res.status(500).send("error at update")
        })
      });

    })
    .catch(err => {
      console.log("some error");
      res.status(500).send("unexpected at update")
    })
};

exports.findList = async function getList() {
  var responseCode = 200;
  var responseData = {};
  const objList = await FileMetadata.find(function(err, docs){
    if(err){
    responseCode = 500
    responseData = err || "Error occurred while getting the list."
       return [responseCode, responseData];
    }else {
      return docs;
    }
  });
  //console.log(objList)
  return [responseCode, objList];
};
