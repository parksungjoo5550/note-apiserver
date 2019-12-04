// Modules
const jwt  = require('jsonwebtoken');

// Models
const User = require('../../../models/').user;

/*
    POST /api/auth/login
    {
        userid,
        password
    }
*/

module.exports = async (req, res) => {
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
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}
