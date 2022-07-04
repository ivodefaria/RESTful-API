//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Article = require(__dirname + "/Article.js");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

// REQUESTS TARGETTING ALL ARTCILES

app.route('/articles')

.get(async(req, res) =>{
  try {
    const articles = await Article.find({});
    res.status(200).send(articles);
  } catch (e) {
    res.status(500).send(e);
  }
})

.post(async(req, res) =>{
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  try {
    await newArticle.save();
    res.status(201).send(newArticle);
  } catch (e) {
    res.status(500).send(e);
  }
})

.delete(async(req, res) =>{
  try {
    const article = await Article.deleteMany();
    res.send(article);
  } catch (e) {
    res.status(500).send(e);
  }
});

// REQUESTS TARGETTING SPECIFIC ARTCILES

app.route('/articles/:articleTitle')

.get(async(req, res) =>{
  try {
    const foundedArticle = await Article.findOne({title: req.params.articleTitle});
    if (!foundedArticle) {
        return res.status(404);
    }
    res.status(200).send(foundedArticle);
  } catch (e) {
    res.status(500).send(e);
  }
})

.put(async(req, res) =>{
  try {
    const updatedArticle = await Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
    );
    res.status(200).send(updatedArticle);
  } catch (e) {
    res.status(500).send(e);
  }
})

.patch(async(req, res) =>{
  try {
    const updatedArticle = await Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      req.body
    );
    res.status(200).send(updatedArticle);
  } catch (e) {
    res.status(500).send(e);
  }
})

.delete(async(req, res) =>{
  try {
    const deletedArticle = await Article.deleteOne({title: req.params.articleTitle});
    res.status(200).send(deletedArticle);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
