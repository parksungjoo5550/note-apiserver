const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/create', auth.login);
router.post('/create', controller.create);

router.use('/list', auth.login);
router.post('/list', controller.list);

router.use('/:examid', auth.login);
router.post('/:examid', controller.get);

module.exports = router;