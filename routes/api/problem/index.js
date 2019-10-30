const path = require('path');
const router = require('express').Router();

const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/create', auth.admin);
router.post('/create', controller.create);

router.use('/inquiry', auth.login)
router.post('/inquiry', controller.inquiry);

module.exports = router;