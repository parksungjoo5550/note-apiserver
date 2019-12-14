// Models
const Student = require('../../../models/').student;
const Room = require('../../../models/').room;

/* 
    * List a room
    
    POST /api/room/delete/:type
    {
		examID    {Integer}
        userid {String}
    }
*/

module.exports = async (req, res) => {
    var type = req.params.type;
    const { examID, userid } = req.body;
    
    try {
		if ( examID == undefined || type == undefined || userid == undefined )
            throw new Error('모든 입력값을 입력해주세요.')
		type = ( type == 'homework' ? Room.HOMEWORK : Room.ASSIGNED );
        
        options = { where: { examID: examID, type: type }};
		
        room = await Room.findOne(options);
        if ( room == null )
            throw new Error('공유중인 학생이 없습니다.');
        
        useridList = room.dataValues.useridList.slice(0, -2).split('$$');
        useridList.splice(useridList.indexOf(userid), 1);
		
        console.log(useridList);
		if ( useridList.length == 0 )
			await Room.destroy(options);
		else
			await Room.update({ useridList: useridList.join('$$') + '$$' }, options);

        res.json({
            success: true,
            message: '공유 삭제가 완료됐습니다.',
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