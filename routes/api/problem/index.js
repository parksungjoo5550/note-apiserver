const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/upload', auth.admin);
router.post('/upload', controller.upload);

router.use('/inquiry', auth.login)
router.post('/inquiry', controller.inquiry);

module.exports = router;