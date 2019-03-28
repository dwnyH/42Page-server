const express = require('express');
const router = express.Router();
const { keywordAPIKey } = require('../db/credentials');
const { flatten } = require('lodash');
const axios = require('axios');
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
  const currentUser = await User.findOne({ _id: req.params.user_id });
  const userInfo = {
    name: currentUser.name,
    imgSrc: currentUser.photoURL,
  };

  res.json(userInfo);
});

router.get('/:user_id/memos/:memo_pageNumber', async(req, res, next) => {
  const memos =
    await Post.find({ user_id: req.params.user_id })
      .sort({ createdAt: 'desc' })
      .skip(10 * (req.params.memo_pageNumber-1))
      .limit(10);

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
    user_id: req.params.user_id,
    'bookInfo.title': req.params.book_title,
  });

  res.json({
    memos,
    chosenBook: memos[0].bookInfo
  });
});

router.get('/:user_id/keywords', async(req, res, next) => {
  const savedWords = {};
  const sortedWords = [];
  let userMemos;
  let userInfoWithKeywords;
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

    for (let key in savedWords) {
      sortedWords.push([key, savedWords[key]]);
    }
    sortedWords.sort((a, b) => {
      return b[1] - a[1];
    });
    const topFiftyKeywords = sortedWords.slice(0,50);

    try {
      userInfoWithKeywords = await User.findByIdAndUpdate(
        { _id: req.params.user_id },
        { $set: { keywords: savedWords } },
        {upsert: true, new: true},
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: serverError,
      });
    }

    console.log(userInfoWithKeywords);

    res.status(200).json(topFiftyKeywords);
  };

  getUserWords();
});

module.exports = router;
