const mongoose = require('mongoose');

// mongoose post schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  address: { type: String, required: true},
  rating: { type: String, required: true},
  imagePath: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
});

module.exports =  mongoose.model('Post', postSchema);
