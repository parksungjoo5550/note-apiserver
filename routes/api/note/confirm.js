// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Note = require('../../../models/').note;
const Problem = require('../../../models/').problem;

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { noteID, correct } = req.body;
    
    try {  
        options = { where: { userid: userid,
                             index: noteID  }};
        
        note = await Note.findOne(options);
        if ( note == null)
            throw new Error('조건에 맞는 채점 대기중인 문제가 없습니다.');
        
        await Note.changeState(options, correct == true ? Note.CORRECT : Note.INCORRECT );

        res.json({
            success: true,
            message: '채점을 완료했습니다.',
            ecode: 200
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