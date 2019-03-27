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

            return res.status(204).json({
                message: 'delete success'
            });
        } else {
            res.status(204).json({
                message: 'delete success'
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'server error'
        })
    }
});

router.put('/:post_id', async(req, res, next) => {
    try {
        const { bookInfo, addedMemo, highlights, isPrivate } = req.body;
        const updatedPost = await Post.findOneAndUpdate({ _id: req.params.post_id }, {
            $set: {
                bookInfo,
                addedMemo,
                highlights,
                isPrivate,
            }}, {new: true});

        if (!updatedPost) {
            return res.status(404).json({
                message: 'post is not Found'
            });
        } else {
            console.log('업뎃완료!', updatedPost);
            res.status(201).json({
                message: 'update success'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'server error'
        })
    }
});

router.get('/memos/:memo_pageNumber', async(req, res, next) => {
    let memos;
    let memoWithProfiles;
    try {
        memos = await Post.find({})
            .sort({ createdAt: 'desc' })
            .limit(10 * req.params.memo_pageNumber)
            .skip(10 * (req.params.memo_pageNumber - 1));
    } catch (err) {
        return res.statusCode(404).json({
            message: 'memo is not found'
        });
    }

    try {
        memoWithProfiles = await Promise.all(memos.map(async(memo) => {
            const userInfo = await User.findOne({_id: memo.user_id});
            memo.user_id = userInfo;

            return {
                bookInfo: memo.bookInfo,
                _id: memo._id,
                isPrivate: memo.isPrivate,
                addedMemo: memo.addedMemo,
                highlights: memo.highlights,
                createdAt: memo.createdAt,
                user_id: userInfo,
            }
        }));
    } catch (err) {
        return res.statusCode(404).json({
            message: 'profile is not found'
        });
    }

    res.json(memoWithProfiles);
  });

module.exports = router;
