const { keywordAPIKey } = require('../db/credentials');
const { flatten } = require('lodash');
const request = require('request');
const User = require('../models/User');
const Post = require('../models/Post');

const axios = require('axios');


// const getUserWords = async() => {
//     let keywordAnalysisResponse;
//     const userMemos = await Post.find({}, 'addedMemo highlights');
//     const userWords = userMemos.map(memo => {
//         return memo.addedMemo + memo.highlights
//     })
//     const text = userWords.toString();
//     try {
//         keywordAnalysisResponse = await axios({
//             method: 'post',
//             url: 'http://aiopen.etri.re.kr:8000/WiseNLU',
//             headers: {'Content-Type':'application/json; charset=UTF-8'},
//             data: {
//                 'access_key': keywordAPIKey,
//                 'argument': {
//                     'text': text,
//                     'analysis_code': 'morp'
//                 }
//             }
//         })
//     } catch(err) {
//         console.log(err);
//     }

//     const saveWords = {};
//     keywordAnalysisResponse.data.return_object.sentence.forEach(sentence => {
//         sentence.morp.forEach((word) => {
//             if (word.type === 'NNG' && saveWords[word.lemma]) {
//                 // allWords.push(word.lemma);
//                 saveWords[word.lemma] ++;
//             } else if (word.type === 'NNG') {
//                 saveWords[word.lemma] = 1;
//             }
//         });
//     });

//     console.log('이고?', saveWords);
// };

// getUserWords();
