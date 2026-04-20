const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const {
  getMenus, createMenu, updateMenu,
  getAllMenus, deleteMenu
} = require('../controllers/pageController');

router.get('/', getMenus);
router.get('/admin/all', auth, requireAdmin, getAllMenus);
router.post('/admin/menus', auth, requireAdmin, createMenu);
router.put('/admin/menus/:id', auth, requireAdmin, updateMenu);
router.delete('/admin/menus/:id', auth, requireAdmin, deleteMenu);

module.exports = router;