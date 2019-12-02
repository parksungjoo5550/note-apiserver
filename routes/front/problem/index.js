const path = require('path');
const multer = require('multer');
const request = require('request')
const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

const upload = multer({ storage: multer.memoryStorage({}), 
                        fileFilter: function (req, file, callback) {
                            let ext = path.extname(file.originalname).toLowerCase();
                            if( ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' ) {
                                return callback(new Error('Only .png, .jpg, .jpeg images are allowed'));
                            }
                            callback(null, true);
                        },
                        limits: {
                            fileSize: 10 * 1024 * 1024,
                        }});

router.use('/create', frontAuth.admin);
router.get('/create', (req, res) => {
    res.render('problem/create');
});

router.post('/create', upload.fields([{ name: 'problem' }, { name: 'solution' }]), (req, res) => { 
    const problem = req.files['problem'][0];
    if ( req.files['solution'] == undefined )
        solution = { buffer:'' };
    else
        solution = req.files['solution'][0];
    
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/problem/create', 
        body: 'POST',
        form: {
            problemFilename: problem.originalname,
            solutionFilename: solution.originalname,
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
        uri: 'http://localhost:3000/api/problem/inquiry/all', 
        method: 'POST',
        body: {
            problemID: req.body.problemID,
            age: req.body.age,
            bigChapter: req.body.bigChapter,
            middleChapter: req.body.middleChapter,
            smallChapter: req.body.smallChapter,
            level: req.body.level,
            source: req.body.source,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            active: req.body.active === "false"? false: true
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        if ( body.success == false ) {
            res.render('problem/inquiry', {
                message: body.message
            });
            return;
        }
        
        res.render('problem/inquiry', {
            message: body.message,
            problemList: body.data.problemList
        });
    });
});

router.get('/update/:problemID', (req, res) => {
    const problemID = req.params.problemID;
    
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/problem/inquiry/all', 
        method: 'POST',
        body: {
            problemID: problemID
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        if ( body.success == false ) {
            res.render('problem/update', {
                message: body.message
            });
            return;
        }
        
        res.render('problem/update', {
            message: body.message,
            problem: body.data.problemList[0]
        });
    });
});

router.post('/update/:problemID', (req, res) => { 
    const problemID = req.params.problemID;

    // Update problem information
    let options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/problem/update', 
        body: 'POST',
        form: {
            problemID: problemID,
            answer: req.body.answer,
            age: req.body.age,
            bigChapter: req.body.bigChapter,
            middleChapter: req.body.middleChapter,
            smallChapter: req.body.smallChapter,
            level: req.body.level,
            source: req.body.source,
            date: req.body.date,
            active: req.body.active === "false"? false: true
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        if ( body.success == false ) {
            res.render('problem/update', {
                message: body.message
            });
            return;
        }
        
        res.render('problem/update', {
            message: body.message,
            problem: body.data.problem
        })
    });
});

module.exports = router;