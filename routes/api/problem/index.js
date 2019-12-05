const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create', require('./create'));

router.use('/update', auth.admin);
router.post('/update', require('./update'));

router.use('/get', auth.login)
router.post('/get', require('./get'));

router.use('/inquiry', auth.login)
router.post('/inquiry', require('./inquiry'));
router.post('/inquiry/:mode', require('./inquiry'));

module.exports = router;