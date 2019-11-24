// Modules
const fs = require('fs');
const path = require('path');
const jwt  = require('jsonwebtoken');

// Models
const User = require('../../../models/').User;
const Student = require('../../../models/').Student;
const Problem = require('../../../models/').Problem;
const Exam = require('../../../models/').Exam;
const Note = require('../../../models/').Note;

/* 
    * Create a user account
    
    POST /api/auth/register
    {
        userid,
        password,
        password2,
        name,
        school,
        admissionYear,
        mathGrade
    }
*/

exports.register = async (req, res) => {
    const { userid, password, password2, name, school, admissionYear, mathGrade } = req.body;
    
    try {
        if ( !userid || !password || !password2 || !name || !school || !admissionYear || !mathGrade ) {
            throw new Error('모든 항목을 입력해주세요.');
        }
        else if ( password != password2 ) {
            throw new Error('확인 비밀번호가 일치하지 않습니다.');
        }
        else if ( password.length < 6 ) {
            throw new Error('비밀번호가 최소 6자리 이상이여야 합니다.');
        }
        else if ( await User.findOneByUserid(userid) ) {
            throw new Error('이미 존재하는 아이디입니다.');
        }
        
        // Create a user.
        await User.create( { userid: userid, password: password } );
        // Create a student.
        await Student.create({ userid: userid, name: name, school: school, admissionYear: admissionYear, mathGrade: mathGrade });
        
        res.json({
            success: true,
            message: '회원 가입이 완료됐습니다.',
            ecode: 200
        });
        
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}

/*
    POST /api/auth/login
    {
        userid,
        password
    }
*/

exports.login = async (req, res) => {
    const { userid, password } = req.body;
    
    try {
        const user = await User.findOneByUserid(userid);
        
        if (!user)
            throw new Error('존재하지 않는 사용자 아이디입니다.');
        if (!user.verify(password))
            throw new Error('비밀번호가 일치하지 않습니다.');
        
        // Create a jwt token.
        const token = await jwt.sign(
            {
                _id: user._id,
                userid: user.userid,
                admin: user.admin
            },
            req.app.get('jwt-secret'),
            {
                expiresIn: '7d',
                issuer: 'kirasys',
                subject: 'userInfo'
            }
        );
            
        res.json({
            success: true,
            message: '로그인 됐습니다.',
            ecode: 200,
            data: { token: token }
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}

/*
    POST /api/auth/resign
    {
        userid,
        password
    }
*/

exports.resign = async (req, res) => {
    const { userid, password } = req.body;
    
    try {
        if ( userid !== req.token.userid )
            throw new Error('Incorrect userid.');
        
        const user = await User.findOneByUserid(userid);
        
        if (!user.verify(password))
            throw new Error('Incorrect password.');
        
        // Delete all involved exams 
        examList = await Exam.findAll({ where: { userid: userid } });
        
        for (let i = 0; i < examList.length; i++){
            fs.unlink(path.join(__basedir, examList[i].dataValues.examURL), function (err) {
                if( err ) console.log(err);
            });
        }
        
        await Exam.destroy({ where: { userid: userid } });
        await Note.destroy({ where: { userid: userid } });
        await Student.destroy({ where: { userid: userid } });
        await User.destroy({ where: { userid: userid } });
        
        res.json({
            success: true,
            message: '회원 탈퇴 됐습니다.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}



/*
    GET /api/auth/validate
    {
        token
    }
*/

exports.validate = (req, res) => {
    res.json({
        success: true,
        message: '',
        ecode: 200,
        data: { token: req.token }
    });
}