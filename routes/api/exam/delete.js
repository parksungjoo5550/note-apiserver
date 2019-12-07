// Modules
const sequelize = require('sequelize');

// Models
const Exam = require('../../../models/').exam;
const Room = require('../../../models/').room;

/* 
    * Delete a exam.
    
    POST /api/exam/delete
    {
        examID {Integer}
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { examID } = req.body;
    
    try {
        exam = await Exam.findAll({ where: { userid: userid, index: examID }});
        
        if ( exam == null)
            throw new Error('시험지가 존재하지 않습니다.');
        
        if ( !req.token.admin && exam.dataValues.type == Room.ASSIGNED )
            throw new Error('삭제할 권한이 없습니다.');
        
        // If the exam is shared
        if ( await Room.isUserIncluded(examID, Room.HOMEWORK, userid) ) {
            await Room.update({ useridList: sequelize.fn('REPLACE', sequelize.col('useridList'), userid + '$$', userid) }, { where: { examID: examID,
                                              type: Room.HOMEWORK,
                                              useridList: { [Sequelize.Op.like]: `%${userid}%` }}});
        }
        
        await Exam.destroy({ where: { userid: userid, index: examID }});
        
        res.json({
            success: true,
            message: '시험지를 삭제했습니다.',
            ecode: 200
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