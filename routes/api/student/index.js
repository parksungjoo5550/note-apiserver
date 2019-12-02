const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/set', auth.login);
router.post('/set', require('./set'));

router.use('/view', auth.login);
router.post('/view', require('./view'));

module.exports = router;