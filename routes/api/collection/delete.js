// Modules
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');

// Models
const Collection = require('../../../models/').collection;
const CollectionProblem = require('../../../models').collection_problem;
const Publish = require('../../../models').publish;

/* 
    * Delete a collection.
    
    POST /api/collection/delete
    {
        collectionID {Integer}
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { collectionID } = req.body;
    
    try {
        collection = await Collection.findOne({ where: { userid: userid, index: collectionID }});
        
        if ( collection == null)
            throw new Error('컬렉션이 존재하지 않습니다.');
        
        if ( collection.dataValues.userid !== userid && (!req.token.admin || req.token.type !== 'teacher' || req.token.type !== 'admin') )
            throw new Error('삭제할 권한이 없습니다.');
        
        // If the collection is published
        await Publish.destroy({ where: { collectionID: collectionID }});
        await Collection.destroy({ where: { userid: userid, index: collectionID }});
        
        // Delete a collection's pdf file
        fs.unlink(path.join(__basedir, collection.dataValues.pdfURL), function (err) {
            if( err ) {
                res.status(403).json({
                    success: false,
                    message: err.message,
                    ecode: 403
                });
                return;
            }
        });
        
        res.json({
            success: true,
            message: '컬렉션을 삭제했습니다.',
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
