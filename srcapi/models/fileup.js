const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileupSchema = new Schema({
  filename: String,
  uploaddate: Date,
  aditionalmetadata: String,
  size: Number,
  filebody: {
    type: Array, items:{ type: Object}
  }
});

module.export = mongoose.model('fileup',FileupSchema);
