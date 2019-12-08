// Models
const Exam = require('../../../models/').exam;

const typeTable = ["assigned", "homework"];
/* 
    * List exam list made by logged in user
    
    POST /api/exam/list
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { type, isDone } = req.body;
          
    try {
        options = { where: { userid: userid }}
        
        if ( type != undefined )
            options.where.type = type;
        if ( isDone != undefined )
            options.where.isDone = isDone;
        
        results = await Exam.findAll(options);
        examList = [];
        
        // Make a array contains problemList.
        for (let i = 0; i < results.length; i++){
            problemIDList = results[i].dataValues.problemIDList.split(' ');
            
            results[i].dataValues.problemCount = problemIDList.length;
            
            examList.push(results[i].dataValues);
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