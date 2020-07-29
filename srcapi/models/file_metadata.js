const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileMetadata = new Schema({
  hashId: String,
  fileName: String,
  uploadDate: Date,
  additionalMetadata: String,
  part1: String,
  part2: String,
  part3: String,
  part4: String,
  part5: String,
  userId: String
});

module.exports = mongoose.model('FileMetadata',FileMetadata);
