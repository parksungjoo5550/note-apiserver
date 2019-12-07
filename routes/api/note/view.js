// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Note = require('../../../models/').note;
const Problem = require('../../../models/').problem;

const stateTable = [ "incorrect", "correct", "unconfirmed", "assigned" ];

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const mode = req.params.mode;
    const { examID, startDate, endDate, bigChapter } = req.body;
    
    try {
        correctCnt = undefined;
        incorrectCnt = undefined;
        unconfirmedCnt = undefined;
        
        options = { where: { userid: userid, state: { [Op.ne]: Note.ASSIGNED }}};
        
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
        else if ( mode == "assigned" )
            options.where.state = Note.ASSIGNED;
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
                            state: stateTable[notes[i].dataValues.state],            
                         });
        }
        
        res.json({
            success: true,
            message: '조건에 맞는 채점 기록을 조회 완료했습니다.',
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
        res.json({
            success: false,
            message: error.message,
            ecode: 403,
        });
    }
}