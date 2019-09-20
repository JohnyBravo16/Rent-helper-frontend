const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// mongoose user schema
const userSchema = mongoose.Schema({
  nick: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, //unique does not validate automatically!
  password: { type: String, required: true }
});

// user form validator
userSchema.plugin(uniqueValidator);

module.exports =  mongoose.model('User', userSchema);
