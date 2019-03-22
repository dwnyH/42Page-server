const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: {type: String, required: true},
  isPrivate: {type: String, required: true},
  highlights: String,
  addedMemo: String,
  bookInfo: {
    title: {type: String, required: String},
    author: String,
    publisher: String,
    img: String,
  },
  comments: Array,
  likes: Array,
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
