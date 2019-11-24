// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Note = require('../../../models/').Note;
const Problem = require('../../../models/').Problem;

exports.view = async (req, res) => {
    const userid = req.token.userid;
    const mode = req.params.mode;
    const { examID, startDate, endDate, bigChapter } = req.body;
    
    try {
        correctCnt = undefined;
        incorrectCnt = undefined;
        unconfirmedCnt = undefined;
        
        options = { where: { userid: userid, state: { [Op.ne]: Note.UNCONFIRMED } } };
        
        // Filter by examID
        if ( examID !== undefined )
            options.where.examID = examID;
        
        // Filter by date information.
        if ( startDate !== undefined && endDate !== undefined )
            options.where.createdAt = { [Op.gte]: startDate, [Op.lte]: endDate};
        else if ( startDate !== undefined )
            options.where.createdAt = { [Op.gte]: startDate};
        else if ( endDate !== undefined )
            options.where.createdAt = { [Op.lte]: endDate};
        
        // Filter by mode.
        if ( mode == "correct")
            options.where.state = Note.CORRECT;
        else if ( mode == "incorrect" )
            options.where.state = Note.INCORRECT;
        else if ( mode == "unconfirmed" )
            options.where.state = Note.UNCONFIRMED;
        else if ( examID !== undefined ) { 
            correctCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.CORRECT } })).count;
            incorrectCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.INCORRECT } })).count;
            unconfirmedCnt = (await Note.findAndCountAll({ where: { userid: userid, examID: examID, state: Note.UNCONFIRMED } })).count;
        }
        notes = await Note.findAll(options);
            
        
        // Make a array contains noteList.
        noteList = [];
        
        for (let i = 0; i < notes.length; i++){
            problem = await Problem.findOneByindex(notes[i].dataValues.problemID);
            
            // filter when mode isn't a undefined
            if ( mode !== undefined ) {
                if ( bigChapter !== undefined && problem.dataValues.bigChapter != bigChapter )
                    continue;
            }
            
            noteList.push({ problemID: notes[i].dataValues.problemID,
                            answer: problem.dataValues.answer,
                            submit: notes[i].dataValues.submit,
                            problemURL: problem.dataValues.problemURL,
                            solutionURL: problem.dataValues.solutionURL,
                            state: notes[i].dataValues.state,            
                         });
        }
        
        res.json({
            success: true,
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
            success: false,
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
            success: true,
            message: 'Successfully calculated a percentage of correct answers',
            ecode: 200,
            data: { correctRate: correctRate * 100 }
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}