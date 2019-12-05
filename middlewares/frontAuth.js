const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const token = req.cookies.token;
    
    try {
        if (!token)
            throw new Error('로그인을 해주세요.');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));
        next();
    }
    catch (error) {
        res.render('auth/login', {
            success: false,
            message: error.message,
            ecode: 403,
        });
    }
}

exports.admin = async (req, res, next) => {
    const token = req.cookies.token;
    
    try {
        if (!token)
            throw new Error('로그인을 해주세요.');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));

        if (req.token.admin == null)
            throw new Error('관리자 권한이 없습니다.');
        else
            next();
    }
    catch (error) {
        res.render('auth/login', {
            success: false,
            message: error.message,
            ecode: 403,
        });
    }
}