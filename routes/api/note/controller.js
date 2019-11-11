// Models
const Note = require('../../../models/').Note;

exports.view = async (req, res) => {
    const userid = req.token.userid;
    const { problemID } = req.body;
    
    try {
        // Query incorrect answer notes.
        results = await Note.findAll({ where: { userid: userid, problemID: problemID, correct: false } });
        
        // Make a array contains noteList.
        noteList = [];
        
        for (let i = 0; i < results.length; i++){
            noteList.push({ answer: results[i].dataValues.answer,
                            createdAt: results[i].dataValues.createdAt
                         });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed noteList.',
            ecode: 200,
            data: { noteList: noteList }
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
        correctNote = await Note.findAndCountAll({ where: { userid: userid, problemID: problemID, correct: true } });
        
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