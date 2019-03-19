const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../db/credentials');

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
            console.log('토큰생성1',token);
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
        const registeredUser = await User.findOne({ uid: req.body.uid });
        console.log('레지스터드', registeredUser);
        req.body.id = registeredUser._id;
        makeJwtToken(req.body);
      } else {
        const newUser = new User(req.body);
        newUser.save((error) => {
          console.log(error);
        });

        const currentUser = await User.findOne({ uid: req.body.id });
        console.log('커런트', currentUser);
        req.body.id = currentUser._id;
        makeJwtToken(req.body);
      }
    }
  });

});

module.exports = router;
