// Modules
const fs =  require('fs');
const path = require('path');

// Models
const Problem = require('../../../models/').problem;

module.exports = async (req, res) => {
    const { problemFilename, solutionFilename,
            problemBase64, solutionBase64,
            isMultipleQuestion, answer, age, bigChapter, middleChapter, smallChapter, level, source, date } = req.body;
    
    try {
        if ( !problemFilename ||
             !problemBase64 ||
             !isMultipleQuestion )
            throw new Error('모든 항목을 입력해주세요.');
        
        // Save Problem and Solution file.
        problemPath = path.join('/uploads/problems', problemFilename);
        fs.writeFile( path.join(__basedir, problemPath), 
                      new Buffer(problemBase64, 'base64'), 
                      (err) => { if (err) throw err; });
        
        if ( solutionFilename != undefined ) {
            solutionPath = path.join('/uploads/solutions', solutionFilename);
            fs.writeFile( path.join(__basedir, solutionPath),
                          new Buffer(solutionBase64, 'base64'),
                          (err) => { if (err) throw err; });
        }
        else
            solutionPath = undefined;
        
        await Problem.create({ problemURL: problemPath,
                               solutionURL: solutionPath,
                               isMultipleQuestion: isMultipleQuestion == "true" ? true: false,
                               answer: answer,
                               age: age,
                               bigChapter: bigChapter,
                               middleChapter: middleChapter,
                               smallChapter: smallChapter,
                               level: level,
                               source: source,
                               date: date });
        
        res.json({
            success: true,
            message: '새로운 문제를 생성하였습니다.',
            ecode: 200
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