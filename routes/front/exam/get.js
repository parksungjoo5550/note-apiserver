// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/exam/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
    try {
        const examID = req.params.examID;

        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'get', 
            body: {
                examID: parseInt(examID)
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);
                
                multipleQuestions = body.data.multipleQuestions.map( (problem) => problem.problemID );
                essayQuestions = body.data.essayQuestions.map( (problem) => problem.problemID );
                res.render('exam/get', {
                    message: body.message,
                    exam: body.data.exam,
                    multipleQuestions: multipleQuestions,
                    essayQuestions: essayQuestions
                });
            }
            catch (error) {
                res.render('exam/get', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('exam/get', { message: error.message });
    }
}