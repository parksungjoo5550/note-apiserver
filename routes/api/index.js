const router = require('express').Router();
const auth = require('./auth');
const student = require('./student');
const problem = require('./problem');
const exam = require('./exam');

router.use('/auth', auth);
router.use('/student', student);
router.use('/problem', problem);
router.use('/exam', exam);

module.exports = router;