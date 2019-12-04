// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Note = require('../../../models/').note;

module.exports = async (req, res) => {
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
            message: '해당 문제에 정답률을 조회 완료했습니다.',
            ecode: 200,
            data: { correctRate: correctRate * 100 }
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