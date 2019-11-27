const path = require('path');
const request = require('request');
const router = require('express').Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;
    const password2 = req.body.password2;
    const name = req.body.name;
    
    const options = {
        uri: 'http://localhost:3000/api/auth/register', 
        method: 'POST',
        body: {
            userid: userid,
            password: password,
            password2: password2,
            name: name
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        if ( body.success == false ) {
            res.render('auth/register', {
                message: body.message
            });
        } 
        else {
            res.render('auth/login', {
                message: '회원가입이 정상적으로 완료됐습니다.'
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;
    
    const options = {
        uri: 'http://localhost:3000/api/auth/login', 
        method: 'POST',
        body: {
            userid: userid,
            password: password
        },
        json: true
    }
    
    request.post(options, (err, httpResponse, body) => {
        if ( body.success == false ) {
            res.render('auth/login', {
                message: body.message
            });
        } 
        else {
            res.cookie('token', body.data.token, {
                magAge: 60*60*60
            });
            
            res.redirect('/front');
        }
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    
    res.render('auth/login', {
        message: '정상적으로 로그아웃 됐습니다.'
    });
});

module.exports = router;