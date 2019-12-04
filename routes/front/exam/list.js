// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/exam/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
    res.render('exam/list');
}

exports.post = (req, res) => { 
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'list', 
            body: {

            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);

                res.render('exam/list', {
                    message: body.message,
                    examList: body.data.examList
                });
            }
            catch (error) {
                res.render('exam/list', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('exam/list', { message: error.message });
    }
}