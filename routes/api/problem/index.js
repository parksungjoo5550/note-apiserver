const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create', require('./create'));

router.use('/update', auth.admin);
router.post('/update', require('./update'));

router.use('/get', auth.login)
router.post('/get', require('./get'));

router.use('/list', auth.login)
router.post('/list', require('./list'));
router.post('/list/:mode', require('./list'));

module.exports = router;