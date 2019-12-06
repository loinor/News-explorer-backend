const article = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleControler');

article.get('/', getArticles);
article.post('/', createArticle);
article.delete('/:articleId', deleteArticle);

module.exports = article;
