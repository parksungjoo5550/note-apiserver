const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

router.use('/list', frontAuth.admin);
router.get('/list', require('./list').get);

router.use('/list', frontAuth.admin);
router.post('/list', require('./list').post);

module.exports = router;