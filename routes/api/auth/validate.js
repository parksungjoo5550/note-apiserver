/*
    GET /api/auth/validate
    {
        
    }
*/

module.exports = (req, res) => {
    res.json({
        success: true,
        message: '',
        ecode: 200,
        data: { 
            userid: req.token.userid,
            admin: req.token.admin
        }
    });
}