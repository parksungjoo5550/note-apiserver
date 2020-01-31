// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/auth/',
    method: 'POST',
    json: true
})

exports.get = (req, res) => {
    res.render('auth/login');
}

exports.post = (req, res) => {
    try {
        const options = {
            uri: 'login', 
            body: {
                username: req.body.userid,
                password: req.body.password
            },
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);
                
                res.cookie('token', body.data.token, {
                    magAge: 60*60*60
                });

                res.redirect('/front');
            }
            catch (error) {
                res.render('auth/login', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('auth/login', { message: error.message });
    }
}