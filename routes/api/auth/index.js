const router = require('express').Router();
const controller = require('./controller');
const auth_Middleware = require('../../../middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);

router.use('/check', auth_Middleware);
router.get('/check', controller.check);

module.exports = router;