// Models
const Problem = require('../../../models/').problem;

module.exports = async (req, res) => {
    try {
        results = await Problem.findAll({ attributes: [[sequelize.literal('DISTINCT `bigChapter`'), 'bigChapter']] });
        bigChapterList = results.map((v) => {
            return v.dataValues.bigChapter;
        });
        
        results = await Problem.findAll({ attributes: [[sequelize.literal('DISTINCT `middleChapter`'), 'middleChapter']] });
        middleChapterList = results.map((v) => {
            return v.dataValues.middleChapter;
        });
        
        results = await Problem.findAll({ attributes: [[sequelize.literal('DISTINCT `smallChapter`'), 'smallChapter']] });
        smallChapterList = results.map((v) => {
            return v.dataValues.smallChapter;
        });
        
        results = await Problem.findAll({ attributes: [[sequelize.literal('DISTINCT `source`'), 'source']] });
        sourceList = results.map((v) => {
            return v.dataValues.source;
        });
        
        res.json({
            success: true,
            message: '문제 카테고리를 조회 완료했습니다.',
            ecode: 200,
            data: { bigChapterList: bigChapterList,
                    middleChapterList: middleChapterList,
                    smallChapterList: smallChapterList,
                    sourceList: sourceList
                  }
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}
