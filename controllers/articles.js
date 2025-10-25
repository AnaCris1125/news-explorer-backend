const Article = require('../models/article');

const getArticles = async (req, res) => {
  const articles = await Article.find({ owner: req.user._id });
  res.send(articles);
};

const createArticle = async (req, res) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const article = await Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id
  });
  res.status(201).send(article);
};

const deleteArticle = async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) return res.status(404).send({ message: 'Artículo no encontrado' });
  if (article.owner.toString() !== req.user._id) return res.status(403).send({ message: 'No puedes borrar este artículo' });
  await Article.findByIdAndDelete(req.params.articleId);
  res.send({ message: 'Artículo eliminado' });
};

module.exports = { getArticles, createArticle, deleteArticle };