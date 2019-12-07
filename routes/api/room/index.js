const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create/:mode', require('./create'));

router.use('/list', auth.admin);
router.post('/list', require('./list'));
router.post('/list/:type', require('./list'));

module.exports = router;