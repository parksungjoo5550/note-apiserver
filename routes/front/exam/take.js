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
            uri: 'take', 
            body: {
                examID: parseInt(examID)
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);
                
                problemIDList = body.data.problemList.map( (problem) => problem.problemID );
                res.render('exam/take', {
                    message: body.message,
                    examID: examID,
                    title: body.data.title,
                    problemIDList: problemIDList
                });
            }
            catch (error) {
                res.render('exam/take', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('exam/take', { message: error.message });
    }
}