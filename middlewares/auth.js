const jwt = require('jsonwebtoken');

const auth_Middleware = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;
    
    try {
        if(!token){
            throw new Error('Not logged in.');
        }
        else {
            req.decoded = await jwt.verify(token, req.app.get('jwt-secret'));
            next();
        }
    }
    catch (error) {
        res.status(403).json({
            message: error.message
        });
    }
}

module.exports = auth_Middleware;