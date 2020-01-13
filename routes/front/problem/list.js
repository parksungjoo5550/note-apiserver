// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/problem/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
    res.render('problem/list');
}

exports.post = (req, res) => {
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'list', 
            body: {
                problemID: req.body.problemID,
                course: req.body.course,
                isMultipleQuestion: req.body.isMultipleQuestion,
                bigChapter: req.body.bigChapter,
                middleChapter: req.body.middleChapter,
                smallChapter: req.body.smallChapter,
                level: req.body.level,
                source: req.body.source,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                active: req.body.active === "false"? false: true
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);

                res.render('problem/list', {
                    message: body.message,
                    problemList: body.data.problemList
                });
            }
            catch (error) {
                res.render('problem/list', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('problem/list', { message: error.message });
    }
}