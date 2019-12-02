const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.post('/register', require('./register'));

router.post('/login', require('./login'));

router.use('/resign', auth.login);
router.post('/resign', require('./resign'));

router.use('/validate', auth.login);
router.get('/validate', require('./validate'));

router.use('/resign', auth.login);
router.get('/resign', require('./resign'));


module.exports = router;