const multer = require('multer');
const request = require('request')
const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

const upload = multer({ storage: multer.memoryStorage({}), 
                        limits: {
                            fieldSize: 8 * 1024 * 1024,
                        } });

router.use('/create', frontAuth.admin);
router.get('/create', (req, res) => {
    res.render('problem/create');
});

router.post('/create', upload.fields([{ name: 'problem' }, { name: 'solution' }]), (req, res) => { 
    const problem = req.files['problem'][0];
    const solution = req.files['solution'][0];
    
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/problem/create', 
        body: 'POST',
        form: {
            problemFilename: [ problem.fieldname, Date.now() ,problem.originalname].join('-'),
            solutionFilename: [ solution.fieldname, Date.now() ,solution.originalname].join('-'),
            problemBase64: problem.buffer.toString('base64'),
            solutionBase64: solution.buffer.toString('base64'),
            isMultipleQuestion: req.body.isMultipleQuestion,
            answer: req.body.answer,
            age: req.body.age,
            bigChapter: req.body.bigChapter,
            middleChapter: req.body.middleChapter,
            smallChapter: req.body.smallChapter,
            level: req.body.level,
            source: req.body.source,
            date: req.body.date
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        res.render('problem/create', {
            message: body.message
        });
    }); 
});

router.use('/inquiry', frontAuth.login);
router.get('/inquiry', (req, res) => {
    res.render('problem/inquiry');
});
router.post('/inquiry', (req, res) => {
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/problem/inquiry', 
        method: 'POST',
        body: {
            age: req.body.age,
            bigChapter: req.body.bigChapter,
            middleChapter: req.body.middleChapter,
            smallChapter: req.body.smallChapter,
            level: req.body.level,
            source: req.body.source,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        res.render('problem/inquiry', {
            message: body.message,
            problems: body.data.problems
        });
    });
})

module.exports = router;