// include related entities
const ChunkData = require("../models/chunk_data.js")

exports.create = (chunkId, chunk) => {
  // define return varaibles
  var responseCode = 200;
  var responseData = "Chunk inserted correctly";

  // create object to be inserted
  const chunkData = new ChunkData({
    chunkId: chunkId,
    chunkContent: chunk,
  });

  // save the object in bd
  chunkData.save(function(err) {
    responseCode = 500
    responseData = err || "Error occurred while uploading chunk."
    if(err) return [responseCode, responseData];
  });
  return [responseCode, responseData];
};
