// Modules
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

// Models
const Exam = require('../../../models/').Exam;
const Problem = require('../../../models/').Problem;
const Note = require('../../../models/').Note;

/* 
    * Create a exam paper
    
    POST /api/exam/create
    {
        title        {string},
        problemList  {Array}
    }
*/

exports.create = async (req, res) => {
    const userid = req.token.userid;
    const { title, problemList } = req.body;
    
    try {
        if ( !title || !problemList )
            throw new Error('Please enter all fields.');

        problemList2 = problemList;
            
        // Create a PDF file.
        doc = new pdfDocument();
        examURL = path.join("/pdfs", ["pdf", Date.now() + '.pdf'].join('-'));
            
        doc.pipe(fs.createWriteStream(path.join(__basedir, examURL)));
            
        // Draw Title.
        doc.fontSize(30);
        doc.text(title, 0, 10, {width: doc.page.width, align: 'center'}); 
            
        // Make a page contain 2 images.
        pageNumber = 1;
            
        while (problemList2.length > 0){
            // Footer
            doc.fontSize(12);                                                 
            doc.page.margins.bottom = 0;
            doc.text(`- ${pageNumber} -`, 0.5 * (doc.page.width - 100), doc.page.height - 40,
            {
                width: 100,
                align: 'center',
                lineBreak: false,
            })
                
            // Vertical line
            doc.moveTo(doc.page.width/2, 50)                                  
               .lineTo(doc.page.width/2, doc.page.height - 50)
               .stroke()
                
            // Image 1
            problem = await Problem.findOneByindex(problemList2[0]);
            if ( problem == null )
                throw new Error(`Problem ${problemList2[0]} doesn't exist.`);
            
            problemList2.shift();
            doc.image(path.join(__basedir, problem.dataValues.problemURL), 10, 50, 
                         { width: doc.page.width/2 - 20 });
   
            // Image 2
            if ( problemList2.length > 0 ) {
                problem = await Problem.findOneByindex(problemList2[0]);
                if ( problem == null )
                    throw new Error(`Problem ${problemList2[0]} doesn't exist.`);
                
                problemList2.shift();
                doc.image(path.join(__basedir, problem.dataValues.problemURL),
                          doc.page.width/2 + 10, 50,
                          { width: doc.page.width/2 - 20 });
            }
                
            if ( problemList2.length == 0 )
                break;
                
            doc.addPage();
            pageNumber++;
        }
            
        doc.end();
            
        await Exam.create({ userid: userid, 
                            title: title, 
                            problemList: problemList.join(' '),
                            examURL: examURL,
                            createdAt: new Date().toISOString()
                         });
        res.json({
            success: 'true',
            message: 'Successfully created a exam.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

/* 
    * List exam papers made by userid
    
    POST /api/exam/list
    {
        * not required *
    }
*/

exports.list = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        // Query by userid.
        results = await Exam.findAll({ where: { userid: userid } });
        examList = [];
        
        // Make a array contains problemList.
        for (let i = 0; i < results.length; i++){
            results[i].dataValues.problemList = results[i].dataValues.problemList.split(' ');
            examList.push({ examID: results[i].dataValues.index,
                          title: results[i].dataValues.title,
                          createdAt: results[i].dataValues.createdAt
                        });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed examList',
            ecode: 200,
            data: { examList: examList }
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

/* 
    * Get problem image files by examid
    
    POST /api/exam/take
    {
        examID {Integer}
    }
*/

exports.get = async (req, res) => {
    const userid = req.token.userid;
    const { examID } = req.body;
    
    try {
        // Query by examid.
        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('That exam doesn\'t exist.');
        
        // Make a array contains problemURL
        problems = [];
        problemList = exam.dataValues.problemList.trim().split(' ');
        
        for (let i = 0; i < problemList.length; i++){
            problem =  await Problem.findOneByindex(problemList[i]);
            if ( problem == null ) // if the problem is removed
                continue; 
            
            problems.push({ problemID: problemList[i], problemURL: problem.dataValues.problemURL });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully got exam\'s information.',
            ecode: 200,
            data: { title: exam.dataValues.title,
                    problems: problems }
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

/* 
    * Confirm the answer
    
    POST /api/exam/confirm/
    {
        examID {integer},
        answers [
            problemID {integer},
            answer    {string}
            ] {array}
    }
*/

exports.confirm = async (req, res) => {
    const userid = req.token.userid;
    const { examID, answers } = req.body;
    
    try {
        if ( !answers )
            throw new Error('Please enter all fields.');

        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('That exam doesn\'t exist.');
        
        // Check every problemID.
        answers.sort();
        problemList = exam.dataValues.problemList.trim().split(' ').sort();
        for ( let i = 0; i < answers.length; i++ ) {
            if ( answers[i].problemID != problemList[i])
                throw new Error('Wrong problemID.');
        }
        
        problemList = [];
        for ( let i = 0; i < answers.length; i++ ) {
            problem = await Problem.findOneByindex(answers[i].problemID);
            if ( problem == null ) 
                throw new Error('Some problem doesn\'t exist.');
            
            // if the problem's answer is wrong, write to Note db.
            if ( problem.dataValues.answer.trim() != answers[i].answer.trim() ) { 
                await Note.create({ userid: userid,
                                    problemID: answers[i].problemID,
                                    answer: answers[i].answer.trim(), 
                                    createdAt: new Date().toISOString()
                                 });
                
                problemList.push(answers[i].problemID);
            }
        }
        
        res.json({
            success: 'true',
            message: 'Successfully completed confirming the exam\'s answer.',
            ecode: 200,
            data: { problemList: problemList }
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}
