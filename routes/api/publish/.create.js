// Models
const Problem = require('../../../models/').problem;
const Exam = require('../../../models/').exam;
const Room = require('../../../models/').room;

/* 
    * Create a room
    
    POST /api/room/create/:type
    {
        examID       {Integer},
        useridList   {Array}
    }
*/

module.exports = async (req, res) => {
    var type = req.params.type;
    var { useridList } = req.body;
    const { examID } = req.body;
    
    try {
        if ( examID == undefined || useridList == undefined || type == undefined )
            throw new Error('모든 항목을 입력해주세요.');
        
        if ( type != 'homework' &&  type != 'assigned' )
            throw new Error('올바르지 않은 공유 타입입니다.');
        
        type = ( type == 'homework' ) ? Room.HOMEWORK : Room.ASSIGNED;
        useridList = Array.from(new Set(useridList));
        
        exam = await Exam.findOneByindex(examID);
        if ( exam == null )
            throw new Error('해당 시험지는 존재하지 않습니다.');

        useridList.forEach( async (userid) => {
            if ( await Room.isUserIncluded(examID, type, userid) )
                return;
            
            await Exam.create({ userid: userid, 
                                title: exam.dataValues.title, 
                                problemIDList: exam.dataValues.problemIDList,
                                examURL: exam.dataValues.examURL,
                                timeLimit: exam.dataValues.timeLimit,
                                type: type,
                                createdAt: new Date().toISOString().substring(0, 19).replace('T',' ')
                             });
        });
        
        room = await Room.isExist(examID, type);
        if ( room ) {
            useridList2 = room.dataValues.useridList.slice(0, -2).split('$$');
            useridList = Array.from(new Set(useridList.concat(useridList2)));
            await Room.update({ useridList: useridList.join('$$') + '$$'},
                              { where: { examID: examID, type: type }});
        }
        else if ( useridList.length ){
            await Room.create({
                examID: examID,
                useridList: useridList.join('$$') + '$$',
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