const router = require('express').Router();
const auth = require('../../../middlewares/auth');

// View api
router.use('/view', auth.login);
router.use('/view/assigned', auth.admin);

router.post('/view', require('./view'));
router.post('/view/:mode', require('./view'));

// Confirm api
router.use('/confirm', auth.login);
router.post('/confirm/:mode', require('./confirm'));

router.use('/confirm/assigned', auth.admin);
router.post('/confirm/assigned', require('./confirm'));

// Rate api
router.use('/rate', auth.login)
router.post('/rate', require('./rate'));

module.exports = router;