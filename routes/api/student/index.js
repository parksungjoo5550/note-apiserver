const router = require('express').Router();
const controller = require('./controller');
const auth_Middleware = require('../../../middlewares/auth');

router.use('/set', auth_Middleware);
router.post('/set', controller.set);

router.use('/view', auth_Middleware);
router.get('/view', controller.view);

module.exports = router;