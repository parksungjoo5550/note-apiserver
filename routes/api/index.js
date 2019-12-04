const router = require('express').Router();
const auth = require('./auth');
const student = require('./student');
const problem = require('./problem');
const exam = require('./exam');
const note = require('./note');
const category = require('./category');
const room = require('./room');

router.use('/auth', auth);
router.use('/student', student);
router.use('/problem', problem);
router.use('/exam', exam);
router.use('/note', note);
router.use('/category', category);
router.use('/room', room);

module.exports = router;