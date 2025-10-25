const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { validateArticle } = require('../middlewares/validators');

router.use(auth);
router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', deleteArticle);

module.exports = router;