// Models
const Problem = require('../../../models/').problem;


module.exports = async (req, res) => {
    const { problemID, answer, age, bigChapter, middleChapter, smallChapter, level, source, date, active } = req.body;
    
    try {
        if ( problemID == undefined )
            throw new Error('문제를 지정해주세요.');
    
        problem =  await Problem.findOneByindex(problemID);
        if ( problem == null ) 
            throw new Error('해당 문제는 존재하지 않습니다.');
        
        let options = {};
        
        if ( answer !== undefined )
            options.answer = answer;
        if ( age !== undefined )
            options.age = age;
        if ( bigChapter !== undefined )
            options.bigChapter = bigChapter;
        if ( middleChapter !== undefined )
            options.middleChapter = middleChapter;
        if ( smallChapter !== undefined )
            options.smallChapter = smallChapter;
        if ( level !== undefined )
            options.level = level;
        if ( source !== undefined )
            options.source = source;
        if ( date !== undefined )
            options.date = date;
        if ( active !== undefined )
            options.active = active;
        
        await Problem.update(options, { where: { index: problemID }});
        
        problem = await Problem.findOneByindex(problemID);
        problem.dataValues.problemID = problemID;
        
        res.json({
            success: true,
            message: '문제 정보 수정하였습니다.',
            ecode: 200,
            data: {
                problem: problem.dataValues
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