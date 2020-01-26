const router = require('express').Router();
const auth = require('./auth');
const student = require('./student');
const teacher = require('./teacher');
const user = require('./user');
const problem = require('./problem');
const collection = require('./collection');
const note = require('./note');
const category = require('./category');
const publish = require('./publish');

router.use('/auth', auth);
router.use('/student', student);
router.use('/teacher', teacher);
router.use('/user', user);
router.use('/problem', problem);
router.use('/collection', collection);
router.use('/note', note);
router.use('/category', category);
router.use('/publish', publish);

module.exports = router;