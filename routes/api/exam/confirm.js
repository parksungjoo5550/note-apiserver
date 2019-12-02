// Models
const Exam = require('../../../models/').exam;
const Problem = require('../../../models/').problem;
const Note = require('../../../models/').note;

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { examID, problemIDList, answerList } = req.body;
    
    try {
        if ( !problemIDList || !answerList )
            throw new Error('모든 항목을 입력해주세요.');

        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('해당 시험지가 존재하지 않습니다.');
        
        for ( let i = 0; i < problemIDList.length; i++ ) {
            problem = await Problem.findOneByindex(problemIDList[i]);
            if ( problem == null ) 
                throw new Error('문제 채점중 오류가 발생했습니다.');
    
            // if the problem's type isn't MultipleQuestion
            if ( problem.dataValues.isMultipleQuestion == false ) {
                answerPath = path.join('/uploads/answers', ['answer', Date.now() + '.jpg'].join('-'));
                fs.writeFile( path.join(__basedir, answerPath ), 
                              new Buffer(answerList[i].trim(), 'base64'), 
                              (err) => { if (err) throw err; });
                
                await Note.create({ userid: userid,
                                    examID: examID,
                                    problemID: problemIDList[i],
                                    submit: answerPath,
                                    state: Note.UNCONFIRMED,
                                    createdAt: new Date().toISOString().split('T')[0]
                                 });
            }
            else {
                state = Note.CORRECT;
                
                // if the problem's answer is wrong, write to Note db.
                if ( problem.dataValues.answer.trim() != answerList[i].trim() ) 
                    state = Note.INCORRECT;

                await Note.create({ userid: userid,
                                    examID: examID,
                                    problemID: problemIDList[i],
                                    submit: answerList[i].trim(),
                                    state: state,
                                    createdAt: new Date().toISOString().split('T')[0]
                                  });
            }
        }
        // Set isDone flag
        Exam.update({ isDone: true }, { where: { index: examID, userid: userid } });
        
        res.json({
            success: true,
            message: '시험지 채점이 완료됐습니다.',
            ecode: 200
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
