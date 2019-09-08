// SOwMjjrVb1HdurPG
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const PostController = require('./controllers/posts');
const userRoutes = require('./routes/user')
const checkAuth = require('./middleware/check-auth');
const extractFile = require('./middleware/file');

const app = express();

mongoose.connect('mongodb+srv://rip222:' + process.env.MONGO_ATLAS_PW + '@cluster0-phzt4.mongodb.net/node-angular&w=majority')
  .then(_ => console.log('Connected to database'))
  .catch(error => console.log(error))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('images')))

app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next();
})

app.use('/api/user', userRoutes);

app.post('/api/posts', checkAuth, extractFile, PostController.createPost);

app.get('/api/posts', PostController.getPosts);

app.get('/api/posts:id', PostController.getPost)

app.put('/api/posts:id', checkAuth, extractFile, PostController.updatePost)

app.delete('/api/posts:id', checkAuth, PostController.deletePost )

module.exports = app;