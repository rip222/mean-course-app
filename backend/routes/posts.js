const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.use('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
})

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfullly',
      postId: result._id
    })
  });
})

router.get('', (req, res, next) => {
  const post = Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'OK',
        posts: documents
      })
    })
    .catch(error => console.error(error)) 
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
    })
})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result)
      res.status(200).json({message: 'Update successful'})
    })
})

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({_id: id})
    .then(_ => {
      res.status(200).json({message: 'Post deleted'})
    })
})

module.exports = router;