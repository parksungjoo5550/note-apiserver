// Modules
const fs = require('fs');
const path = require('path');

// Models
const User = require('../../../models/').user;
const Student = require('../../../models/').student;
const Problem = require('../../../models/').problem;
const Exam = require('../../../models/').exam;
const Note = require('../../../models/').note;

/*
    POST /api/auth/resign
    {
        userid,
        password
    }
*/

module.exports = async (req, res) => {
    const { userid, password } = req.body;
    
    try {
        if ( userid !== req.token.userid )
            throw new Error('Incorrect userid.');
        
        const user = await User.findOneByUserid(userid);
        
        if (!user.verify(password))
            throw new Error('Incorrect password.');
        
        // Delete all involved exams 
        examList = await Exam.findAll({ where: { userid: userid } });
        
        for (let i = 0; i < examList.length; i++){
            fs.unlink(path.join(__basedir, examList[i].dataValues.examURL), function (err) {
                if( err ) console.log(err);
            });
        }
        
        await Exam.destroy({ where: { userid: userid } });
        await Note.destroy({ where: { userid: userid } });
        await Student.destroy({ where: { userid: userid } });
        await User.destroy({ where: { userid: userid } });
        
        res.json({
            success: true,
            message: '회원 탈퇴 됐습니다.',
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