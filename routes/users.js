const express = require('express');
const router = express.Router();
const { keywordAPIKey } = require('../db/credentials');
const { flatten } = require('lodash');
const axios = require('axios');
const request = require('request');
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
      res.status(201).json({
        message: 'saved!'
      });
    });
  }
})

router.get('/:user_id/userInfo', async(req, res, next) => {
  console.log(req.params);
  const currentUser = await User.findOne({ _id: req.params.user_id });
  console.log(currentUser);
  const userInfo = {
    name: currentUser.name,
    imgSrc: currentUser.photoURL,
    // bookTotal: currentUser.books.length,
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

  res.json(userBooks);
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

router.get('/:user_id/keywords', async(req, res, next) => {
  const savedWords = {};
  let userMemos;
  const getUserWords = async() => {
    let keywordAnalysisResponse;
    try {
      userMemos = await Post.find({user_id: req.params.user_id}, 'addedMemo highlights');
    } catch(err) {
      console.log(err);
      return res.status(500).json({
        message: 'system error'
      });
    }

    const userWords = userMemos.map(memo => {
        return memo.addedMemo + memo.highlights
    })
    const text = userWords.toString();

    try {
        keywordAnalysisResponse = await axios({
            method: 'post',
            url: 'http://aiopen.etri.re.kr:8000/WiseNLU',
            headers: {'Content-Type':'application/json; charset=UTF-8'},
            data: {
                'access_key': keywordAPIKey,
                'argument': {
                    'text': text,
                    'analysis_code': 'morp'
                }
            }
        })
    } catch(err) {
      console.log(err);
      res.status(404).json({
        message: 'Not found'
      });
    }

    keywordAnalysisResponse.data.return_object.sentence.forEach(sentence => {
        sentence.morp.forEach((word) => {
            if (word.type === 'NNG' && savedWords[word.lemma]) {
                savedWords[word.lemma] ++;
            } else if (word.type === 'NNG') {
                savedWords[word.lemma] = 1;
            }
        });
    });

    console.log('이고?', savedWords);
    res.status(200).json(savedWords);
  };

  getUserWords();
});

module.exports = router;
