const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/list', auth.admin);
router.post('/list', require('./list'));

module.exports = router;