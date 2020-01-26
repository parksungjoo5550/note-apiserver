// Models
const Collection = require('../../../models/').collection;
const CollectionProblem = require('../../../models').collection_problem;
const Problem = require('../../../models/').problem;


module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { collectionID } = req.body;
    
    try {
        if ( !collectionID ) {
            throw new Error('모든 항목을 입력해주세요');
        }
        // Query by collectionID.
        collection = await Collection.findOne({
            where: {
                index: collectionID,
                userid: userid
            }
        });
        // Throw error if collection isn't found.
        if ( collection == null ) 
            throw new Error('해당 컬렉션이 존재하지 않습니다.');
        
        // Make an array contains problemURL
        multipleQuestions = [];
        essayQuestions = [];

        problemIDList = await CollectionProblem.listProblemIdByCollectionId(collectionID);
        if ( problemIDList.length === 0 )
            throw new Error('잘못된 컬렉션입니다.')
        
        for (let i = 0; i < problemIDList.length; i++) {
            problem = await Problem.findOneByIndex(problemIDList[i].dataValues.problemID);
            if ( problem == null ) // if the problem is removed
                continue;

            if ( problem.dataValues.isMultipleQuestion )
                multipleQuestions.push( problem.dataValues );
            else
                essayQuestions.push( problem.dataValues );
        }
        
        res.json({
            success: true,
            message: '해당 컬렉션의 정보를 조회 완료했습니다.',
            ecode: 200,
            data: { 
                collection: collection.dataValues,
                multipleQuestions: multipleQuestions,
                essayQuestions: essayQuestions
            }
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