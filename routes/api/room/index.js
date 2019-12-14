const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create/:type', require('./create'));

router.use('/get', auth.admin);
router.post('/get/:type', require('./get'));

router.use('/delete', auth.admin);
router.post('/delete/:type', require('./delete'));

module.exports = router;