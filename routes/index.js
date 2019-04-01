const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../db/credentials');
const vision = require('@google-cloud/vision');
const authMiddleware = require('../middlewares/auth');

router.post('/auth', (req, res) => {
  const makeJwtToken = (userInfo) => {
    try {
      jwt.sign(userInfo,
        secret,
        {
          issuer: 'book-memo',
          subject: 'userInfo',
        }, (error, token) => {
          if (error) {
            console.log(error);
            res.status(403).json({
              message: error.message,
            });
          } else {
            res.status(200).json({
              message: 'logged in successfully',
              token,
              id: userInfo.id,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  User.findOne({ uid: req.body.uid }, async(err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        try {
          const registeredUser = await User.findOne({ uid: req.body.uid });
          req.body.id = registeredUser._id;
          makeJwtToken(req.body);
        } catch (err) {
          console.log(err);
        }
      } else {
        const newUser = new User(req.body);
        newUser.save((error) => {
          console.log(error);
        });

        try {
          const currentUser = await User.findOne({ uid: req.body.uid });
          req.body.id = currentUser._id;
          makeJwtToken(req.body);
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
});

router.get('/keywords/:keyword/users', authMiddleware, async(req, res, next) => {
  let users;
  let keyword = req.params.keyword;

  try {
    users = await User.find().exists(`keywords.${keyword}`, true);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'server error'
    });
  }

  res.status(200).json(users);
});

module.exports = router;
