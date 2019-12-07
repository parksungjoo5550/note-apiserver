// Models
const Exam = require('../../../models/').exam;

/* 
    * List exam list made by logged in user
    
    POST /api/exam/list
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        // Query by userid.
        results = await Exam.findAll({ where: { userid: userid } });
        examList = [];
        
        // Make a array contains problemList.
        for (let i = 0; i < results.length; i++){
            results[i].dataValues.problemIDList = results[i].dataValues.problemIDList.split(' ');
            examList.push({ examID: results[i].dataValues.index,
                            title: results[i].dataValues.title,
                            type: results[i].dataValues.type,
                            isDone: results[i].dataValues.isDone,
                            createdAt: results[i].dataValues.createdAt
                          });
        }
        
        res.json({
            success: true,
            message: '모든 시험지 리스트를 조회 완료했습니다.',
            ecode: 200,
            data: { examList: examList }
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