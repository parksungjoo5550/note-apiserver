// Models
const Problem = require('../../../models/').problem;
const Exam = require('../../../models/').exam;
const Room = require('../../../models/').room;

/* 
    * Share a exam
    
    POST /api/exam/share
    {
        examID       {Integer},
        useridList   {Array},
        type         {Integer},
    }
*/

module.exports = async (req, res) => {
    var { useridList } = req.body;
    const { examID, type } = req.body;
    
    try {
        if ( examID == undefined || !useridList || type == undefined)
            throw new Error('모든 항목을 입력해주세요.');
        
        if ( type != Room.ASSIGNED && type != Room.HOMEWORK) 
            throw new Error('올바르지 않은 공유 타입입니다.');
        
        exam = await Exam.findOneByindex(examID);
        if ( exam == null )
            throw new Error('해당 시험지는 존재하지 않습니다.');
        
        
        useridList = Array.from(new Set(useridList));
        newUseridList = [];
        
        useridList.forEach( async (userid) => {
            if ( (await Room.isUserIncluded(examID, type, userid)) == null)
                newUseridList.push(userid);
            
            await Exam.create({ userid: userid, 
                                title: exam.dataValues.title, 
                                problemIDList: exam.dataValues.problemIDList,
                                examURL: exam.dataValues.examURL,
                                timeLimit: exam.dataValues.timeLimit,
                                createdAt: new Date().toISOString().substring(0, 19).replace('T',' ')
                             });
        });
        
        room = await Room.isExist(examID, type);
        if ( room ) {
            if ( newUseridList.length > 0 )
                await Room.update({ useridList: room.dataValues.useridList + '$$' + newUseridList.join('$$') },
                            { where: { examID: examID, type: type }});
        }
        else {
            await Room.create({
                examID: examID,
                useridList: newUseridList.join('$$'),
                type: type
            });
        }
        
        res.json({
            success: true,
            message: '해당 시험지를 공유 완료했습니다.',
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