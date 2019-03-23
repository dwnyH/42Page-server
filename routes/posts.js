const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

router.delete('/:post_id', async(req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.post_id });
        const userId = post.user_id;
        const bookInfo = post.bookInfo;
        await post.remove();
        const remainPosts = await Post.find({ user_id: post.user_id, bookInfo });

        if (!remainPosts.length) {
            await User.findOneAndUpdate({_id: userId},
                {$pull: {books: bookInfo}});

            res.status(200).json({
                deletedBook: bookInfo,
                deletedMemo: req.params.post_id
            });
        } else {
            res.status(200).json({
                deletedBook: null,
                deletedMemo: req.params.post_id
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            test:'testing'
        })
    }
});

module.exports = router;
