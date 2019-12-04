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
    try {
        
    }
    catch (error) {
        res.render('category/list', {
            message: error.message
        });
    }
}