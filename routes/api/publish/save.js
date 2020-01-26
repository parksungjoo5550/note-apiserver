// Models
const Note = require('../../../models/').note;
const Publish = require('../../../models/').publish;

/* 
    * Save progress on the publish
      by making notes.
    
    POST /api/publish/save
    {
        * required
        publishID     {Integer}
        * not required
        remainingTime {Integer}
    }
*/

module.exports = async (req, res) => {
    const token = req.token;
    const { publishID, remainingTime } = req.body;
    
    try {
        if ( publishID == undefined )
            throw new Error('모든 입력값을 입력해주세요.')

        options = { where: { id: publishID }};
        
        publish = await Publish.findOne(options);
        if ( publish == null )
            throw new Error('발행이 존재하지 않습니다.');
        if ( token.type === 'student' ) {
            if ( publish.dataValues.studentID !== token.userid )
                throw new Error('권한이 없습니다.');
        } else if ( token.type === 'teacher' ) {
            if ( publish.dataValues.teacherID !== token.userid )
                throw new Error('권한이 없습니다.');
        }

        
        
        await Publish.update({
            state: Publish.SAVED
        }, options);

        res.json({
            success: true,
            message: '발행물 풀이를 중간 저장했습니다.',
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