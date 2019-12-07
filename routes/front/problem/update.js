// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/problem/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'inquiry/all', 
            body: {
                problemID: req.params.problemID
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);

                res.render('problem/update', {
                    message: body.message,
                    problem: body.data.problemList[0]
                });
            }
            catch (error) {
                res.render('problem/update', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('problem/update', { message: error.message });
    }
}

exports.post = (req, res) => { 
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'update', 
            body: {
                problemID: req.params.problemID,
                answer: req.body.answer,
                course: req.body.course,
                bigChapter: req.body.bigChapter,
                middleChapter: req.body.middleChapter,
                smallChapter: req.body.smallChapter,
                level: req.body.level,
                source: req.body.source,
                date: req.body.date,
                active: req.body.active === "false"? false: true
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                if ( body.success == false )
                    throw new Error(body.message);

                res.render('problem/update', {
                    message: body.message,
                    problem: body.data.problem
                });
            }
            catch (error) {
                res.render('problem/update', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('problem/update', { message: error.message });
    }
}