const router = require('express').Router();
const auth = require('./auth');
//const student = require('./student');
//const problem = require('./problem');

router.use('/auth', auth);
//router.use('/student', student);
//router.use('/problem', problem);

module.exports = router;