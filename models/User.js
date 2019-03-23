const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  uid: { type: String, required: true },
  photoURL: { type: String },
  books: Array,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
