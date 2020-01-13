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
    const { problemID, course, isMultipleQuestion,
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
        if ( course !== undefined && course !== '' )
            options.course = course;
        if ( isMultipleQuestion !== undefined && isMultipleQuestion !== '' )
            options.isMultipleQuestion = (isMultipleQuestion === "true"? true: false);
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

        if ( count != undefined && count != '' && results.length > count )
            results = shuffle(results).slice(0, count);
        
        problemList = results.map( (r) => {
            return r.dataValues;
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