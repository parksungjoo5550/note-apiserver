// Models
const Exam = require('../../../models/').exam;
const Problem = require('../../../models/').problem;


module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { examID } = req.body;
    
    try {
        // Query by examid.
        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('해당 시험지가 존재하지 않습니다.');
        
        // Make a array contains problemURL
        multipleQuestions = [];
        essayQuestions = [];
        problemIDList = exam.dataValues.problemIDList.trim().split(' ');
        
        for (let i = 0; i < problemIDList.length; i++) {
            problem =  await Problem.findOneByindex(problemIDList[i]);
            if ( problem == null ) // if the problem is removed
                continue; 
            
            if ( problem.dataValues.isMultipleQuestion ) {
                multipleQuestions.push({ problemID: parseInt(problemIDList[i]),
                                   problemURL: problem.dataValues.problemURL,
                                   isMultipleQuestion: problem.dataValues.isMultipleQuestion
                                 });
            }
            else {
                essayQuestions.push({ problemID: parseInt(problemIDList[i]),
                                   problemURL: problem.dataValues.problemURL,
                                   isMultipleQuestion: problem.dataValues.isMultipleQuestion
                                 });
            }
        }
        
        res.json({
            success: true,
            message: '해당 시험지의 정보를 조회 완료했습니다.',
            ecode: 200,
            data: { 
                title: exam.dataValues.title,
                multipleQuestions: multipleQuestions,
                essayQuestions: essayQuestions
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}