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
            throw new Error('Please enter all fields.');
        }
        else if ( password != password2 ) {
            throw new Error('Passwords don\'t match.');
        }
        else if ( password.length < 6 ) {
            throw new Error('Password must be at least 6 characters.');
        }
        else if ( await User.findOneByUserid(userid) ) {
            throw new Error('Userid already exists.');
        }
        
        // Create a user.
        await User.create( { userid: userid, password: password } );
        // Create a student.
        await Student.create({ userid: userid, name: name, school: school, admissionYear: admissionYear, mathGrade: mathGrade });
        
        res.json({
            success: true,
            message: 'Registered successfully.',
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
            throw new Error('Incorrect userid.');
        if (!user.verify(password))
            throw new Error('Incorrect password.');
        
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
            message: 'Logged in successfully.',
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
            message: 'Successfully resigned.',
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