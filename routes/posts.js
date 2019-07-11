const express = require('express'),
  router = express.Router(),
  mongo = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  url = 'mongodb://localhost:27017/trello',
  sockets = require('../lib/sockets')
;

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return
  }
  const db = client.db('trello');


  router.get('/', (req, res) => {
    db.collection('posts')
      .find({author : {$ne : req.session.user._id}})
      .sort({date:-1})
      .toArray((err, posts) => {
        res.render('posts', {posts}, (err, html) => {
          res.json({response : html})
        })
    })
  });

  router.get('/:id', (req, res) => {
    db.collection('posts')
      .findOne({author : {$ne : req.session.user._id}, _id : new ObjectId(req.params.id)}, (err, post) => {
        res.render('posts', {posts : [post]}, (err, html) => {
          res.json({response : html})
        })
    })
  });

  router.post('/', (req, res) => {
    db.collection('posts')
      .insertOne({
        post : req.body.post,
        author : req.session.user._id,
        pseudo : req.session.user.username,
        date:new Date()}, (err, result) => {
        if(err) throw err ;
        console.log(result.insertedId)
        sockets.sendAll(req.session.user._id, 'post', result.insertedId)
        res.send('ADDED')
      })
  })

})


module.exports = router;
