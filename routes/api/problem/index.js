const router = require('express').Router();

const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create', controller.create);

router.use('/get', auth.login)
router.post('/get', controller.get);

router.use('/inquiry', auth.login)
router.post('/inquiry', controller.inquiry);

router.use('/category', auth.login)
router.post('/category', controller.category);

module.exports = router;