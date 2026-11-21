const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/lead.controller');

router.use(auth);
router.get('/stats', c.getStats); // must come before /:id
router.route('/').get(c.getLeads).post(c.createLead);
router.route('/:id').put(c.updateLead).delete(c.deleteLead);

module.exports = router;
