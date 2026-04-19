const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const { getMenus, createMenu, updateMenu } = require('../controllers/pageController');

router.get('/', getMenus);
router.post('/admin/menus', auth, requireAdmin, createMenu);
router.put('/admin/menus/:id', auth, requireAdmin, updateMenu);

module.exports = router;