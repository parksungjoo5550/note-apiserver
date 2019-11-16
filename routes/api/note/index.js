const router = require('express').Router();

const controller = require('./controller');
const auth = require('../../../middlewares/auth');

router.use('/view', auth.login);
router.post('/view', controller.view);
//router.post('/view/incorrect', controller.incorrect);
//router.post('/view/correct', controller.incorrect);
//router.post('/view/unconfirmed', controller.unconfirmed);

router.use('/rate', auth.login)
router.post('/rate', controller.rate);

module.exports = router;