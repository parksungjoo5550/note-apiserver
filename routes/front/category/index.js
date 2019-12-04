const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

router.use('/list', frontAuth.login);
router.get('/list', require('./list').get);
//router.post('/list', require('./list').post);


module.exports = router;