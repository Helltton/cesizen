const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/requireAdmin');
const optionalAuth = require('../middlewares/optionalAuth');
const {
  getEvents, submit, getResult, getUserResults,
  createEvent, updateEvent, deactivateEvent, activateEvent,
  getConfigs, updateConfig, createConfig, getAllEvents
} = require('../controllers/diagnosticController');

router.get('/events', getEvents);
router.post('/submit', optionalAuth, submit);
router.get('/results/:id', auth, getResult);
router.get('/admin/events/all', auth, requireAdmin, getAllEvents);
router.post('/admin/events', auth, requireAdmin, createEvent);
router.put('/admin/events/:id', auth, requireAdmin, updateEvent);
router.patch('/admin/events/:id/deactivate', auth, requireAdmin, deactivateEvent);
router.patch('/admin/events/:id/activate', auth, requireAdmin, activateEvent);
router.get('/admin/config', auth, requireAdmin, getConfigs);
router.post('/admin/config', auth, requireAdmin, createConfig);
router.put('/admin/config/:id', auth, requireAdmin, updateConfig);
router.get('/my-results', auth, getUserResults);

module.exports = router;