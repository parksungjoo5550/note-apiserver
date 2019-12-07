const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create/:mode', require('./create'));

router.use('/list', auth.admin);
router.post('/list/:mode', require('./list'));

module.exports = router;