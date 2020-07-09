// include related entities
const FileMetadata = require("../models/file_metadata")

exports.create = (hashId, fileName, additionalMetadata) => {
  // define return varaibles
  var responseCode = 200;
  var responseData = "Inserted correctly";
  // get current date
  let currentDate = Date.now();

  // create object to be inserted
  const fileMetadata = new FileMetadata({
    hashId: hashId,
    fileName: fileName,
    uploadDate: currentDate,
    additionalMetadata: additionalMetadata
  });

  // save the object in bd
  fileMetadata.save(function(err) {
    responseCode = 500
    responseData = err || "Error occurred while creating new file."
    if(err) return [responseCode, responseData];
  });
  return [responseCode, responseData];
};

exports.update = (hashId, chunkId, position) => {
  var responseCode = 200;
  var responseData = "Updated correctly";

  const filter = { hashId: hashId };
  const update = { part1: chunkId};

  FileMetadata.findOneAndUpdate(filter, update, function(err) {
    responseCode = 500
    responseData = err || "Error occurred while creating new file."
    if(err) return [responseCode, responseData];
  });

  return [responseCode, responseData];
}

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
}
