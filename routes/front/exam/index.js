const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

router.use('/create', frontAuth.login);
router.get('/create', require('./create').get);
router.post('/create', require('./create').post);

router.use('/list', frontAuth.login);
router.get('/list', require('./list').get);
router.post('/list', require('./list').post);

router.use('/get', frontAuth.login);
router.get('/get/:examID', require('./get').get);


module.exports = router;