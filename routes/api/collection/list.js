// Models
const Collection = require('../../../models/').collection;
const CollectionProblem = require('../../../models').collection_problem;

const typeTable = ["assigned", "homework"];
/* 
    * List collection made by logged in user
    
    POST /api/collection/list
    {
        * not required *
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { type, isDone } = req.body;
          
    try {
        options = { where: { userid: userid }}
        
        if ( type != undefined )
            options.where.type = type;
        if ( isDone != undefined )
            options.where.isDone = isDone;
        
        results = await Collection.findAll(options);
        collectionList = [];
        
        // Make an array contains problemList.
        for (let i = 0; i < results.length; i++){
            problemIDList = await CollectionProblem.listProblemIdByCollectionId(results[i].dataValues.index);
            results[i].dataValues.problemCount = problemIDList.length;
            collectionList.push(results[i].dataValues);
        }
        
        res.json({
            success: true,
            message: '모든 컬렉션 리스트를 조회 완료했습니다.',
            ecode: 200,
            data: { collectionList: collectionList }
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
