const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  age: Number,
  // id is generated automatically by mLab
});

module.exports = mongoose.model('Author', authorSchema);