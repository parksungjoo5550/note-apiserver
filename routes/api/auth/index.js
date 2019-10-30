const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);

router.use('/validate', auth.login);
router.get('/validate', controller.validate);

module.exports = router;