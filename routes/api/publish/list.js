// Models
const Collection = require('../../../models/').collection;
const Publish = require('../../../models/').publish;

/* 
    * List publishes
      made by logged in teacher
      or
      received to logged in student.
    
    POST /api/publish/list/
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const token = req.token;
    
    try {
        options = {
            where: {}
        };
        if ( token.type === 'admin' || token.type === 'teacher' ) {
            options.where.teacherID = token.userid;
        } else if ( token.type === 'student' ) {
            options.where.studentID = token.userid;
        } else {
            throw new Error('권한이 없습니다.');
        }
        
        results = await Publish.findAll(options);
        publishList = [];
      
        for (let i = 0; i < results.length; i++) {
            collection = await Collection.findOneByIndex(results[i].dataValues.collectionID);
            results[i].dataValues.collection = collection.dataValues;
            publishList.push(results[i].dataValues);
        }

        res.json({
            success: true,
            message: '발행 리스트를 조회 완료했습니다.',
            data: {
                publishList: publishList
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