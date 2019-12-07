// Models
const Student = require('../../../models/').student;
const Room = require('../../../models/').room;

/* 
    * List a room
    
    POST /api/room/list/:type
    {
        examID    {Integer}
    }
*/

module.exports = async (req, res) => {
    var type = req.params.type;
    const { examID } = req.body;
    
    try {
        options = {};
        
        if ( examID !== undefined )
            options.examID = examID;
        if ( type !== undefined )
            options.type = ( type == 'homework' ) ? Room.HOMEWORK : Room.ASSIGNED;;
        
        room = await Room.findOne({ where: options });
        if ( room == null )
            throw new Error('공유중인 학생이 없습니다.');
        
        useridList = room.dataValues.useridList.split('$$');
        nameList = await Promise.all(
            useridList.map( async (userid) => {
                student = await Student.findOne({ attributes: ['name'], where: { userid: userid }});
                if ( student )
                    return student.dataValues.name;
            })
        );

        res.json({
            success: true,
            message: '공유중인 학생 리스트를 조회 완료했습니다.',
            data: {
                useridList: useridList,
                nameList: nameList 
            },
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