const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const optionalAuth = require('../middlewares/optionalAuth');
const {
  getEvents, submit, getResult,
  createEvent, updateEvent, deactivateEvent,
  getConfigs, updateConfig, createConfig
} = require('../controllers/diagnosticController');

router.get('/events', getEvents);
router.post('/submit', optionalAuth, submit);
router.get('/results/:id', auth, getResult);
router.post('/admin/events', auth, requireAdmin, createEvent);
router.put('/admin/events/:id', auth, requireAdmin, updateEvent);
router.patch('/admin/events/:id/deactivate', auth, requireAdmin, deactivateEvent);
router.get('/admin/config', auth, requireAdmin, getConfigs);
router.post('/admin/config', auth, requireAdmin, createConfig);
router.put('/admin/config/:id', auth, requireAdmin, updateConfig);

module.exports = router;