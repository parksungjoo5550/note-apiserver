// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/auth/',
    method: 'POST',
    json: true
})

exports.get = (req, res) => {
    res.render('auth/register');
}

exports.post = (req, res) => {
    try {
        const options = {
            uri: 'register',
            body: {
                userid: req.body.userid,
                password: req.body.password,
                password2: req.body.password2,
                name: req.body.name,
                school: req.body.school,
                admissionYear: req.body.admissionYear,
                mathGrade: req.body.mathGrade
            },
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);

                res.render('auth/login', { message: body.message });
            }
            catch (error) {
                res.render('auth/register', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('auth/register', { message: error.message });
    }
}