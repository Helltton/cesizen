const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const { getPage, updatePage, createPage } = require('../controllers/pageController');

router.get('/:slug', getPage);
router.post('/admin/pages', auth, requireAdmin, createPage);
router.put('/admin/pages/:id', auth, requireAdmin, updatePage);

module.exports = router;