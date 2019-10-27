const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/set', auth.login);
router.post('/set', controller.set);

router.use('/view', auth.login);
router.get('/view', controller.view);

module.exports = router;