const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create/', require('./create'));

router.use('/delete', auth.login);
router.post('/delete/', require('./delete'));

router.use('/list', auth.login);
router.post('/list', require('./list'));

router.use('/open', auth.login);
router.post('/open/', require('./open'));

router.use('/save', auth.login);
router.post('/save/', require('./save'));

/*
router.use('/submit', auth.login);
router.post('/submit/', require('./submit'));

router.use('/confirm', auth.login);
router.post('/confirm/', require('./confirm'));
*/

module.exports = router;
