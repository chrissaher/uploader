const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chunkdata = new Schema({
  chunkId: String,
  chunkContent: String
});

module.exports = mongoose.model('Chunkdata',Chunkdata);
