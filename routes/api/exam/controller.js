const Exam = require('../../../models/').Exam;

/* 
    * Create a exam paper
    
    POST /api/exam/create
    {
        title     {string},
        problems  {array}
    }
*/

exports.create = async (req, res) => {
    const userid = req.token.userid;
    const { title, problems } = req.body;
    
    try {
        if ( !title || !problems ) {
            throw new Error('Please enter all fields.');
        }
        else {
            await Exam.create({ userid: userid, title: title, problems: problems.join(' ') });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully created a exam paper.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

/* 
    * List exam papers made by user
    
    POST /api/exam/list
    {
        * not required *
    }
*/

exports.list = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        let results = await Exam.findAll({ where: { userid: userid } });
        let papers = [];
        
        for (let i = 0; i < results.length; i++){
            results[i].dataValues.problems = results[i].dataValues.problems.split(' ');
            papers.push(results[i].dataValues);
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed papers',
            ecode: 200,
            data: { papers: papers }
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}