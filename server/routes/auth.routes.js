const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { signup, login, me } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
