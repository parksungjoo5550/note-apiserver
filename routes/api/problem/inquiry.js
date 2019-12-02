// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Problem = require('../../../models/').problem;

module.exports = async (req, res) => {
    const { problemID, age, isMultipleQuestion, bigChapter, middleChapter, smallChapter, level, source, startDate, endDate, active } = req.body;
    const mode = req.params.mode;
    
    try {
        let options = mode === 'all' ? {} : { active: true };
        
        if ( problemID !== undefined && problemID !== '' )
            options.index = parseInt(problemID);
        if ( age !== undefined && age !== '' )
            options.age = age;
        if ( isMultipleQuestion !== undefined && isMultipleQuestion !== '' )
            options.isMultipleQuestion = isMultipleQuestion == "true"? true: false;
        if ( bigChapter !== undefined && bigChapter !== '' )
            options.bigChapter = bigChapter;
        if ( middleChapter !== undefined && middleChapter !== '' )
            options.middleChapter = middleChapter;
        if ( smallChapter !== undefined && smallChapter !== '' )
            options.smallChapter = smallChapter;
        if ( level !== undefined && level !== '' )
            options.level = level;
        if ( source !== undefined && source !== '' )
            options.source = source;
        if ( startDate !== undefined && startDate !== '' )
            options.date = { [Op.gte]: startDate };
        if ( endDate !== undefined && endDate !== '' )
            options.date = { [Op.lte]: endDate };
        if ( active !== undefined )
            options.active = active;
        
        let results = await Problem.findAll({ where: options });
        let problemList = [];
        
        for (let i = 0; i < results.length; i++) {
            let problem = {};
            
            if ( mode == 'all' ) {
                problem = results[i].dataValues;
                problem.problemID = problem.index;
            }
            else {
                problem = { problemID: results[i].dataValues.index,
                                problemURL: results[i].dataValues.problemURL, 
                                isMultipleQuestion: results[i].dataValues.isMultipleQuestion,
                                problemCondition: {
                                    age: results[i].dataValues.age,
                                    bigChapter: results[i].dataValues.bigChapter,
                                    middleChapter: results[i].dataValues.middleChapter,
                                    smallChapter: results[i].dataValues.smallChapter,
                                    level: results[i].dataValues.level,
                                    source: results[i].dataValues.source
                                }
                              };
            }
            problemList.push(problem);
        }
        
        res.json({
            success: true,
            message: '조건에 맞는 문제 리스트를 조회 완료했습니다.',
            ecode: 200,
            data: { problemList: problemList },
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