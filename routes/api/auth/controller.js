// Modules
const jwt  = require('jsonwebtoken');

// Models
const User = require('../../../models/').User;
const Student = require('../../../models/').Student;

/* 
    * Create a user account
    
    POST /api/auth/register
    {
        userid,
        password,
        password2,
        name
    }
*/

exports.register = async (req, res) => {
    const { userid, password, password2, name } = req.body;
    
    try {
        if ( !userid || !password || !password2 || !name ) {
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
        await Student.create({ userid: userid, name: name });
        
        res.json({
            success: 'true',
            message: 'Registered successfully.',
            ecode: 200
        });
        
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = async (req, res) => {
    const { userid, password } = req.body;
    
    try {
        const user = await User.findOneByUserid(userid);
        
        if (!user) {
            throw new Error('Incorrect userid.');
        }
        else if ( !user.verify(password) ){
            throw new Error('Incorrect password.');
        }
        else {
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
                success: 'true',
                message: 'Logged in successfully.',
                ecode: 200,
                data: { token: token }
            });
        }
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
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
        success: 'true',
        message: '',
        ecode: 200,
        data: { token: req.token }
    });
}