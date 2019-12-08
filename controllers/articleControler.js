const Article = require('../models/articleModel');
const NotFoundErr = require('../errors/notFoundErr');
const EntitlementErr = require('../errors/entitlementErr');
const GeneralErr = require('../errors/generalErr');

const getArticles = ((req, res, next) => {
  Article.find({})
    .then((article) => res.status(200).send({ data: article }))
    .catch(next);
});

const createArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send({ data: article });
    }).catch(next);
};

const deleteArticle = ((req, res, next) => {
  const { articleId } = req.params;
  const currentUser = req.user._id;
  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundErr('Запрашиваемый ресурс не найден;');
      }
      const articleOwner = article.owner.toString();
      if (articleOwner !== currentUser) {
        throw new EntitlementErr('Недостаточно прав');
      } else {
        Article.findByIdAndRemove(articleId)
          .then((removedArt) => {
            if (!removedArt) {
              throw new GeneralErr('Не удалось найти статью');
            }
            res.send({ data: removedArt });
          })
          .catch(next);
      }
    })
    .catch(next);
});

module.exports = { getArticles, createArticle, deleteArticle };
