const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

/* GET users listing. */
router.post('/:user_id/posts', async (req, res, next) => {
  const currentUser = await User.findOne({ _id: req.params.user_id });

  if (currentUser) {
    req.body.user_id = currentUser._id;
    const newPost = new Post(req.body);
    newPost.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }

      const bookDuplicated = currentUser.books.some(book => (
        book.title === req.body.bookInfo.title
      ));

      if (!bookDuplicated) {
        currentUser.updateOne({
          $push: {
            posts: newPost._id,
            books: newPost.bookInfo,
          }
        }, (err) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
        });
      } else {
        currentUser.updateOne({
          $push: {
            posts: newPost._id,
          }
        }, (err) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
        });
      }
    });
  }
})

module.exports = router;
