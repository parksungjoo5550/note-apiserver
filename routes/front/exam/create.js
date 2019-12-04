// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/exam/',
    method: 'POST',
    json: true
})

exports.get = (req, res) => {
    res.render('exam/create');
}

exports.post = (req, res) => {
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'create', 
            body: {
                title: req.body.title,
                problemIDList: req.body.problemIDList.trim().split(' '),
                timeLimit: parseInt(req.body.timeLimit)
            }
        }
        
        api.post(options, (err, httpResponse, body) => {
            res.render('exam/create', {
                message: body.message
            });
        }); 
    }
    catch (error) {
        res.render('exam/create', { message: error.message });
    }
}