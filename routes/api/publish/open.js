// Models
const Publish = require('../../../models/').publish;

/* 
    * Open a publish and start solving problems.
    
    POST /api/publish/open
    {
        publishID    {Integer}
    }
*/

module.exports = async (req, res) => {
    const token = req.token;
    const { publishID } = req.body;
    
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
            state: Publish.OPENED
        }, options);
      
        publish = await Publish.findOne(options);

        res.json({
            success: true,
            message: '발행물을 풀기 시작했습니다.',
            data: {
                publish: publish.dataValues
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