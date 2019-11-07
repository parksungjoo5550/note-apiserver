const path = require('path');
const request = require('request')
const router = require('express').Router();
const frontAuth = require('../../../middlewares/frontAuth');

router.use('/create', frontAuth.login);
router.get('/create', (req, res) => {
    res.render('exam/create');
});

router.post('/create', (req, res) => { 
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/exam/create', 
        body: 'POST',
        form: {
            title: req.body.title,
            problems: req.body.problems
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        res.render('exam/create', {
            message: body.message
        });
    }); 
});

router.use('/list', frontAuth.login);
router.get('/list', (req, res) => {
    res.render('exam/list');
});

router.post('/list', (req, res) => { 
    const options = {
        headers: {
            'x-access-token': req.cookies.token
        },
        uri: 'http://localhost:3000/api/exam/list', 
        body: 'POST',
        form: {
            
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        res.render('exam/list', {
            message: body.message,
            papers: body.data.papers
        });
    }); 
});

module.exports = router;