// Models
const Problem = require('../../../models/').problem;
const Exam = require('../../../models/').exam;
const Note = require('../../../models/').note;


module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { noteID} = req.body;
    
    try {  
        options = { where: { userid: userid, index: noteID }};

        note = await Note.findOne(options);
        if ( note == null )
            throw new Error('조건에 일치하는 채점 기록이 없습니다.');
        
        exam = await Exam.findOneByindex(note.dataValues.examID);
        problem = await Problem.findOneByindex(note.dataValues.problemID);
        
        if ( !exam || !problem)
            throw new Error('잘못된 채점 기록입니다.')
        
        res.json({
            success: true,
            message: '조건에 맞는 채점 기록을 조회 완료했습니다.',
            ecode: 200,
            data: { 
                note: note.dataValues,
                exam: exam.dataValues,
                problem: problem.dataValues,
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