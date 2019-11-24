// Modules
const fs =  require('fs');
const path = require('path');
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Problem = require('../../../models/').Problem;

exports.create = async (req, res) => {
    const { problemFilename, solutionFilename,
            problemBase64, solutionBase64,
            isMultipleQuestion, answer, age, bigChapter, middleChapter, smallChapter, level, source, date } = req.body;
    
    try {
        if ( !problemFilename || !solutionFilename ||
             !problemBase64 || !solutionBase64 || 
             !isMultipleQuestion )
            throw new Error('Please enter all fields.');
        
        if ( problemFilename.indexOf('/') >=0 || problemFilename.indexOf('\\') >= 0 )
            throw new Error('Bad problemFilename.');
        if ( solutionFilename.indexOf('/') >=0 || solutionFilename.indexOf('\\') >= 0 )
            throw new Error('Bad solutionFilename.');
        
        // Save Problem and Solution file.
        problemPath = path.join('/uploads/problems', problemFilename);
        fs.writeFile( path.join(__basedir, problemPath), 
                      new Buffer(problemBase64, 'base64'), 
                      (err) => { if (err) throw err; });
        
        solutionPath = path.join('/uploads/solutions', solutionFilename);
        fs.writeFile( path.join(__basedir, solutionPath),
                      new Buffer(solutionBase64, 'base64'),
                      (err) => { if (err) throw err; });
        
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
            message: 'Successfully created a problem.',
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

exports.get = async (req, res) => {
    const { problemID } = req.body;
    
    try {
        problem =  await Problem.findOneByindex(problemID);
        if ( problem == null ) 
            throw new Error('That problem doesn\'t exist.');
        
        res.json({
            success: true,
            message: 'Successfully got problem information',
            ecode: 200,
            data: { problemID: problem.dataValues.index,
                    problemURL: problem.dataValues.problemURL,
                    isMultipleQuestion: problem.dataValues.isMultipleQuestion },
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

exports.inquiry = async (req, res) => {
    const { age, isMultipleQuestion, bigChapter, middleChapter, smallChapter, level, source, startDate, endDate } = req.body;

    try {
        let options = {};
        
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
        
        let results = await Problem.findAll({ where: options });
        let problemList = [];
        
        for (let i = 0; i < results.length; i++)
            problemList.push({ problemID: results[i].dataValues.index,
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
                          });
        
        res.json({
            success: true,
            message: 'Successfully inquiried a problem database',
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

exports.category = async (req, res) => {
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
            message: 'Successfully inquiried a problem database',
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
