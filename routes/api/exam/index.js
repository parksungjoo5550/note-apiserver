const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create', controller.create);

router.use('/list', auth.login);
router.post('/list', controller.list);

router.use('/take', auth.login);
router.post('/take', controller.get);

router.use('/confirm', auth.login);
router.post('/confirm', controller.confirm);

module.exports = router;