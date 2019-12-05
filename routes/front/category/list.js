// Modules
const request = require('request');

// Request object
const api = request.defaults({
    baseUrl: __baseurl + '/api/category/',
    method: 'POST',
    json: true
});

exports.get = (req, res) => {
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
                
                res.render('category/list', {
                    bigChapterList: body.data.categories
                });
            }
            catch (error) {
                res.render('category/list', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('category/list', { message: error.message });
    }
}

exports.post = (req, res) => {
    const bigChapter = req.body.bigChapter2 || req.body.bigChapter;
    const middleChapter = req.body.middleChapter2 || req.body.middleChapter;
    const smallChapter = req.body.smallChapter2 || req.body.smallChapter;
    
    try {
        const options = {
            headers: { 'x-access-token': req.cookies.token },
            uri: 'create', 
            body: {
                bigChapter: bigChapter,
                middleChapter: middleChapter,
                smallChapter: smallChapter
            }
        }

        api.post(options, (err, httpResponse, body) => {
            try {
                res.render('category/list', { message: body.message });
            }
            catch (error) {
                res.render('category/list', { message: error.message });
            }
        });
    }
    catch (error) {
        res.render('category/list', { message: error.message });
    }
}