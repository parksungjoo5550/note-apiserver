// Modules
const fs = require('fs');
const path = require('path');
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
        exam = await Exam.findOne({ where: { userid: userid, index: examID }});
        
        if ( exam == null)
            throw new Error('시험지가 존재하지 않습니다.');
        
        if ( !req.token.admin && exam.dataValues.type == Room.ASSIGNED )
            throw new Error('삭제할 권한이 없습니다.');
        
        // If the exam is shared
        await Room.destroy({ where: { examID: examID }});
        await Exam.destroy({ where: { userid: userid, index: examID }});
        
        // Delete a exam's pdf file
        fs.unlink(path.join(__basedir, exam.dataValues.examURL), function (err) {
            if( err ) {
                res.status(403).json({
                    success: false,
                    message: err.message,
                    ecode: 403
                });
                return;
            }
        });
        
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