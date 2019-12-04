const router = require('express').Router();

router.get('/register', require('./register').get);
router.post('/register', require('./register').post);

router.get('/login', require('./login').get);
router.post('/login', require('./login').post);

router.get('/logout', require('./logout').get);

module.exports = router;