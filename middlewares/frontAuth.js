const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const token = req.cookies.token;
    
    try {
        if (!token)
            throw new Error('Not logged in');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));
        next();
    }
    catch (error) {
        res.render('auth/login', {
            message: error.message
        });
    }
}

exports.admin = async (req, res, next) => {
    const token = req.cookies.token;
    
    try {
        if (!token)
            throw new Error('Not logged in.');
        
        req.token = await jwt.verify(token, req.app.get('jwt-secret'));

        if (req.token.admin == null)
            throw new Error('You are not a admin.');
        else
            next();
    }
    catch (error) {
        res.render('auth/login', {
            message: error.message
        });
    }
}