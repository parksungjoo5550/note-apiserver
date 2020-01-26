const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/get', auth.login);
router.post('/get', require('./get'));

module.exports = router;