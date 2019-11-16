const router = require('express').Router();

const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/view', auth.login);
router.post('/view', controller.view);
router.post('/view/:mode', controller.view);

router.use('/rate', auth.login)
router.post('/rate', controller.rate);

module.exports = router;