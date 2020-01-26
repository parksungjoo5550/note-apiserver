// Modules
const fs = require('fs');
const path = require('path');

// Models
const Collection = require('../../../models/').collection;
const Publish = require('../../../models/').publish;
const Student = require('../../../models/').student;
const Note = require('../../../models/').note;


module.exports = async (req, res) => {
    const token = req.token;
    const { collectionID, targetUseridList } = req.body;
    
    try {
        if ( !collectionID || !targetUseridList )
            throw new Error('모든 항목을 입력해주세요.');
        // Non-regular student can't publish collection.
        // Student can't publish collection to others.
        if ( token.type === 'student' ) {
            student = await Student.findOneByUserid(token.userid);
            if ( student == null )
                throw new Error('잘못된 계정입니다.');
            else {
                if ( student.dataValues.isRegular == false || !(targetUseridList.length === 1 && targetUseridList.includes(token.userid)) )
                    throw new Error('권한이 없습니다.');
            }
        }
        collection = await Collection.findOne({ where: { index: collectionID, userid: token.userid } });
        if ( collection == null ) 
            throw new Error('해당 컬렉션이 존재하지 않습니다.');

        Publish.bulkCreate(targetUseridList.map(targetUserid => {
            return {
                teacherID: token.type === 'student' ? null : token.userid,
                studentID: targetUserid,
                collectionID: collectionID,
                state: Publish.PUBLISHED
            };
        }));

        res.json({
            success: true,
            message: '컬렉션 시험지를 배부했습니다.',
            data: {
              message: 'ok'  
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
