const router = require('express').Router();
const auth = require('../../../middlewares/auth');

// View api
router.use('/list', auth.login);
router.use('/list/assigned', auth.admin);

router.post('/list', require('./list'));
router.post('/list/:mode', require('./list'));

// Get api
router.use('/get', auth.login);
router.post('/get', require('./get'));

// Confirm api
router.use('/confirm', auth.login);
router.post('/confirm', require('./confirm'));

// Rate api
router.use('/rate', auth.login)
router.post('/rate', require('./rate'));

module.exports = router;