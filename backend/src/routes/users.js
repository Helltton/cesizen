const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const { getMe, updateMe, getAllUsers, createAdmin, deactivateUser, deleteUser, reactivateUser } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/admin', auth, requireAdmin, getAllUsers);
router.post('/admin', auth, requireAdmin, createAdmin);
router.patch('/admin/:id/deactivate', auth, requireAdmin, deactivateUser);
router.delete('/admin/:id', auth, requireAdmin, deleteUser);
router.patch('/admin/:id/activate', auth, requireAdmin, reactivateUser);

module.exports = router;