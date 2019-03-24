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

          res.sendStatus(200);
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

          res.sendStatus(200);
        });
      }
    });
  }
})

router.get('/:user_id/userInfo', async(req, res, next) => {
  const currentUser = await User.findOne({ _id: req.params.user_id });
  const userInfo = {
    name: currentUser.name,
    imgSrc: currentUser.photoURL,
    bookTotal: currentUser.books.length,
  };

  res.json(userInfo);
});

router.get('/:user_id/memos/:memo_pageNumber', async(req, res, next) => {
  const memos =
    await Post.find({ user_id: req.params.user_id })
      .sort({ createdAt: 'desc' })
      .limit(10 * req.params.memo_pageNumber)
      .skip(10 * (req.params.memo_pageNumber - 1))
  console.log(memos);
  res.json(memos);
});

router.get('/:user_id/books', async(req, res, next) => {
  const userPosts = await Post.find({ user_id: req.params.user_id });
  const userBooks = userPosts.reduce((allBooks, book) => {
    if (!allBooks.includes(JSON.stringify(book.bookInfo))) {
      allBooks.push(JSON.stringify(book.bookInfo));
    }
    return allBooks;
  }, []);

  res.json(userBooks.reverse());
});

router.get('/:user_id/books/:book_title/memos', async(req, res, next) => {
  const memos = await Post.find({
    user_id: req.params.user_id, 'bookInfo.title': req.params.book_title
  });
  console.log('보이니?', memos);

  res.json({
    memos,
    chosenBook: memos[0].bookInfo
  });
});

module.exports = router;
