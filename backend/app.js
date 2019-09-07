// SOwMjjrVb1HdurPG
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const Post = require('./models/post');
const userRoutes = require('./routes/user')
const checkAuth = require('./middleware/check-auth');
const app = express();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '-.' + ext);
  }
})

mongoose.connect('mongodb+srv://rip222:SOwMjjrVb1HdurPG@cluster0-phzt4.mongodb.net/node-angular&w=majority')
  .then(_ => console.log('Connected to database'))
  .catch(error => console.log(error))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')))

app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next();
})

app.use('/api/user', userRoutes);

app.post(
  '/api/posts',
  checkAuth,
  multer({storage: storage}).single('image'), 
  (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId // this comes from checkAuth middleware
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfullly',
      post: {
        ...result,
        id: result._id,
      }
    })
  });
})

app.get('/api/posts', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments()
    })
    .then(count => {
      res.status(200).json({
        message: 'OK',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(error => console.error(error)) 
});

app.get('/api/posts:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
    })
})

app.put(
  '/api/posts:id', 
  checkAuth,
  multer({storage: storage}).single('image'), 
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Update successful', post: post})
      } else {
        res.status(401).json({message: 'Not Authorized'})
      }
    })
})

app.delete('/api/posts:id', checkAuth, (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({_id: id, creator: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Post deleted'})
      } else {
        res.status(401).json({message: 'Not Authorized'})
      }
    })
})

module.exports = app;