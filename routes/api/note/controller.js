// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Note = require('../../../models/').Note;
const Problem = require('../../../models/').Problem;

exports.view = async (req, res) => {
    const userid = req.token.userid;
    const mode = req.params.mode;
    const { examID } = req.body;
    
    try {
        correctCnt = undefined;
        incorrectCnt = undefined;
        unconfirmedCnt = undefined;
        
        if ( mode == "correct")
            exam = await Note.findAll({ where: { userid: userid, examID: examID, state: Note.CORRECT } });
        else if ( mode == "incorrect" )
            exam = await Note.findAll({ where: { userid: userid, examID: examID, state: Note.INCORRECT } });
        else if ( mode == "unconfirmed" )
            exam = await Note.findAll({ where: { userid: userid, examID: examID, state: Note.UNCONFIRMED } });
        else { // except none multpleQustion problem.
            exam = await Note.findAll({ where: { userid: userid, examID: examID, state: { [Op.ne]: Note.UNCONFIRMED } } });
            
            correctCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.CORRECT } })).count;
            incorrectCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.INCORRECT } })).count;
            unconfirmedCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.UNCONFIRMED } })).count;
        }
        
        // Make a array contains noteList.
        noteList = [];
        
        for (let i = 0; i < exam.length; i++){
            problem = await Problem.findOneByindex(exam[i].dataValues.problemID);
            
            
            noteList.push({ problemID: exam[i].dataValues.problemID,
                            answer: problem.dataValues.answer,
                            submit: exam[i].dataValues.answer,
                            problemURL: problem.dataValues.problemURL,
                            solutionURL: problem.dataValues.solutionURL,
                            state: exam[i].dataValues.state,            
                         });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed noteList.',
            ecode: 200,
            data: { 
                      noteList: noteList,
                      correctCnt: correctCnt,
                      incorrectCnt: incorrectCnt,
                      unconfirmedCnt: unconfirmedCnt
                  }
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403,
        });
    }
}

exports.rate = async (req, res) => {
    const userid = req.token.userid;
    const { problemID } = req.body;
    
    try {
        // Query all answer notes except unconfirmed notes.
        allNote =  await Note.findAndCountAll({ where: { userid: userid, problemID: problemID, state: { [Op.ne]: Note.UNCONFIRMED } } });
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