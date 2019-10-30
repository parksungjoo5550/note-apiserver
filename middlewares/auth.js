const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.cookies.token;
    
    try {
        if (!token)
            throw new Error('Not logged in.');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));
        next();
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

exports.admin = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;
    
    try {
        if (!token)
            throw new Error('Not logged in.');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));
        
        if (req.token.admin == false)
            throw new Error('You are not a admin.');
        else
            next();
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}