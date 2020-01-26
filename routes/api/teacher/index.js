const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/set', auth.login);
router.post('/set', require('./set'));

router.use('/list', auth.admin);
router.post('/list', require('./list'));

module.exports = router;