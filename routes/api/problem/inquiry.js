// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Problem = require('../../../models/').problem;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

module.exports = async (req, res) => {
    const { problemID, age, isMultipleQuestion,
            bigChapter, middleChapter, smallChapter,
            level, source,
            startDate, endDate,
            active,
            count } = req.body;
    
    const mode = req.params.mode;
    
    try {
        options = mode === 'all' ? {} : { active: true };
        
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
        
        results = await Problem.findAll({ where: options });
        if ( results.length > count )
            results = shuffle(results).slice(0, count);
        
        problemList = results.map( (r) => {
            problem = {};
            
            if ( mode == 'all' ) {
                problem = r.dataValues;
                problem.problemID = problem.index;
            }
            else {
                problem = { 
                            problemID: r.dataValues.index,
                            problemURL: r.dataValues.problemURL, 
                            isMultipleQuestion: r.dataValues.isMultipleQuestion,
                            problemCondition: {
                                age: r.dataValues.age,
                                bigChapter: r.dataValues.bigChapter,
                                middleChapter: r.dataValues.middleChapter,
                                smallChapter: r.dataValues.smallChapter,
                                level: r.dataValues.level,
                                source: r.dataValues.source
                            }
                          };
            }
            
            return problem;
        });
        
        res.json({
            success: true,
            message: '조건에 맞는 문제를 조회 완료했습니다.',
            ecode: 200,
            data: { problemList: problemList },
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