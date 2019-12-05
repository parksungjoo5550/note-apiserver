const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create', require('./create'));

router.use('/list', auth.admin);
router.post('/list', require('./list'));

module.exports = router;