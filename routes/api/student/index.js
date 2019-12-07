const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/set', auth.login);
router.post('/set', require('./set'));

router.use('/view', auth.login);
router.post('/view', require('./view'));

router.use('/list', auth.login);
router.post('/list', require('./list'));

module.exports = router;