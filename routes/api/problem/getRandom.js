// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Problem = require('../../../models/').problem;
const DislikedProblem = require('../../../models/').disliked_problem;

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
    const { course, isMultipleQuestion,
            bigChapter, middleChapter, smallChapter,
            level, source,
            startDate, endDate,
            active,
            count } = req.body;
    const token = req.token;
    
    try {
        options = { active: true };
        
        if ( count == undefined && course == '' )
            count = 1;
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
        
        // Blacklist problems excluded.
        if (token.type === 'admin' || token.type === 'teacher') {
            dislikedProblemList = await DislikedProblem.listByUserId(token.userid);
            if (dislikedProblemList.length > 0) {
                dislikedProblemIDList = dislikedProblemList.map(x => x.index);
                problemList = problemList.filter(x => {
                    return !dislikedProblemIDList.includes(x.index);
                });
            }
        }
        
        res.json({
            success: true,
            message: '조건에 맞는 문제를 랜덤으로 조회했습니다.',
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