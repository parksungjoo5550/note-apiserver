// Models
const Note = require('../../../models/').Note;

exports.view = async (req, res) => {
    const userid = req.token.userid;
    const { examID } = req.body;
    
    try {
        // Query incorrect answer notes.
        exam = await Note.findAll({ where: { userid: userid, examID: examID } });
        
        // Make a array contains noteList.
        problemList = [];
        
        for (let i = 0; i < exam.length; i++){
            problemList.push({ problemID: exam[i].dataValues.problemID,
                               answer: exam[i].dataValues.answer,
                               state: exam[i].dataValues.state,
                             });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed noteList.',
            ecode: 200,
            data: { problemList: problemList }
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

exports.rate = async (req, res) => {
    const userid = req.token.userid;
    const { problemID } = req.body;
    
    try {
        // Query all answer notes.
        allNote =  await Note.findAndCountAll({ where: { userid: userid, problemID: problemID } });
        // Query correct answer notes.
        correctNote = await Note.findAndCountAll({ where: { userid: userid, problemID: problemID, state: Note.CORRECT } });
        
        if ( allNote.count != 0 )
            correctRate = correctNote.count / allNote.count;
        else
            correctRate = 0;
        
        res.json({
            success: 'true',
            message: 'Successfully calculated a percentage of correct answers',
            ecode: 200,
            data: { correctRate: correctRate * 100 }
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