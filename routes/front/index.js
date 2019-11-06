const path = require('path');
const router = require('express').Router();

const auth = require('./auth');
const student = require('./student');
const problem = require('./problem');
const exam = require('./exam');
const frontAuth = require('../../middlewares/frontAuth');

router.use('/auth', auth);
router.use('/student', student);
router.use('/problem', problem);
router.use('/exam', exam);

router.use('/', frontAuth.login);
router.get('/', (req, res) => {
    res.render('index', {
        token: req.token
    });
});


module.exports = router;