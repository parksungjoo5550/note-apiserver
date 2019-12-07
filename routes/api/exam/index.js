const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create', require('./create'));

router.use('/list', auth.login);
router.post('/list', require('./list'));

router.use('/take', auth.login);
router.post('/take', require('./take'));

router.use('/confirm', auth.login);
router.post('/confirm', require('./confirm'));

router.use('/delete', auth.login);
router.post('/delete', require('./delete'));

module.exports = router;