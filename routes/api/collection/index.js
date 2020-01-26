const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create', require('./create'));

router.use('/list', auth.login);
router.post('/list', require('./list'));

router.use('/get', auth.login);
router.post('/get', require('./get'));

router.use('/publish', auth.login);
router.post('/publish', require('./publish'));

router.use('/delete', auth.login);
router.post('/delete', require('./delete'));

module.exports = router;