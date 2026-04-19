const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const { getMe, updateMe, getAllUsers, createAdmin, deactivateUser, deleteUser } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/admin/users', auth, requireAdmin, getAllUsers);
router.post('/admin/users', auth, requireAdmin, createAdmin);
router.patch('/admin/users/:id/deactivate', auth, requireAdmin, deactivateUser);
router.delete('/admin/users/:id', auth, requireAdmin, deleteUser);

module.exports = router;