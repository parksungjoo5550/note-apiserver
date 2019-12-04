// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/problem/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
    res.render('problem/create');
}

exports.post = (req, res) => {
    try {
        const problem = req.files['problem'][0];

        if ( req.files['solution'] == undefined )
            solution = { buffer:'' };
        else
            solution = req.files['solution'][0];

        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'create', 
            body: {
                problemFilename: problem.originalname,
                solutionFilename: solution.originalname,
                problemBase64: problem.buffer.toString('base64'),
                solutionBase64: solution.buffer.toString('base64'),
                isMultipleQuestion: req.body.isMultipleQuestion,
                answer: req.body.answer,
                age: req.body.age,
                bigChapter: req.body.bigChapter,
                middleChapter: req.body.middleChapter,
                smallChapter: req.body.smallChapter,
                level: req.body.level,
                source: req.body.source,
                date: req.body.date
            }
        }

        api.post(options, (err, httpResponse, body) => {
            res.render('problem/create', {  message: body.message });
        }); 
    }
    catch (error) {
        res.render('problem/create', { message: error.message });
    }
}