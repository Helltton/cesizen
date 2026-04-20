const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const {
  getMenus, getPage, createMenu, updateMenu,
  createPage, updatePage, getAllMenus, deleteMenu, deletePage
} = require('../controllers/pageController');

router.get('/:slug', getPage);
router.post('/admin/pages', auth, requireAdmin, createPage);
router.put('/admin/pages/:id', auth, requireAdmin, updatePage);
router.delete('/admin/pages/:id', auth, requireAdmin, deletePage);

module.exports = router;