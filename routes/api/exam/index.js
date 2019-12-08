const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create', require('./create'));

router.use('/list', auth.login);
router.post('/list', require('./list'));

router.use('/get', auth.login);
router.post('/get', require('./get'));

router.use('/confirm', auth.login);
router.post('/confirm', require('./confirm'));

router.use('/delete', auth.login);
router.post('/delete', require('./delete'));

module.exports = router;