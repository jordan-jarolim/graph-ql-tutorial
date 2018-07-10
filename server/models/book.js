const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String,
  // id is generated automatically by mLab
});

module.export = mongoose.model('Book', bookSchema);