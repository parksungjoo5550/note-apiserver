const router = require('express').Router();
const auth = require('../../../middlewares/auth');

router.use('/view', auth.login);
router.post('/view', require('./view'));
router.post('/view/:mode', require('./view'));

router.use('/view/assigned', auth.admin);
router.post('/view', require('./view'));


router.use('/rate', auth.login)
router.post('/rate', require('./rate'));

module.exports = router;