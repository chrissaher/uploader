// include related entities
const FileMetadata = require("../models/file_metadata.js")

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
