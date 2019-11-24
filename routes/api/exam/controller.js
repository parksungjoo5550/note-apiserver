// Modules
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

// Models
const Exam = require('../../../models/').Exam;
const Problem = require('../../../models/').Problem;
const Note = require('../../../models/').Note;

/* 
    * Create a exam
    
    POST /api/exam/create
    {
        title        {string},
        problemIDList  {Array}
    }
*/

exports.create = async (req, res) => {
    const userid = req.token.userid;
    const { title, problemIDList } = req.body;
    
    try {
        if ( !title || !problemIDList )
            throw new Error('Please enter all fields.');

        problemIDList2 = problemIDList.slice();
            
        // Create a PDF file.
        doc = new pdfDocument();
        examURL = path.join("/uploads/pdfs", ["pdf", Date.now() + '.pdf'].join('-'));
            
        doc.pipe(fs.createWriteStream(path.join(__basedir, examURL)));
            
        // Draw Title.
        doc.fontSize(30);
        doc.text(title, 0, 10, {width: doc.page.width, align: 'center'}); 
            
        // Make a page contain 2 images.
        pageNumber = 1;
            
        while (problemIDList2.length > 0){
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
            problem = await Problem.findOneByindex(problemIDList2[0]);
            if ( problem == null )
                throw new Error(`Problem ${problemIDList2[0]} doesn't exist.`);
            
            problemIDList2.shift();
            doc.image(path.join(__basedir, problem.dataValues.problemURL), 10, 50, 
                         { width: doc.page.width/2 - 20 });
   
            // Image 2
            if ( problemIDList2.length > 0 ) {
                problem = await Problem.findOneByindex(problemIDList2[0]);
                if ( problem == null )
                    throw new Error(`Problem ${problemIDList2[0]} doesn't exist.`);
                
                problemIDList2.shift();
                doc.image(path.join(__basedir, problem.dataValues.problemURL),
                          doc.page.width/2 + 10, 50,
                          { width: doc.page.width/2 - 20 });
            }
                
            if ( problemIDList2.length == 0 )
                break;
                
            doc.addPage();
            pageNumber++;
        }
            
        doc.end();
        
        console.log(problemIDList.join(' '));
        await Exam.create({ userid: userid, 
                            title: title, 
                            problemIDList: problemIDList.join(' '),
                            examURL: examURL,
                            createdAt: new Date().toISOString().substring(0, 19).replace('T',' ')
                         });
        res.json({
            success: true,
            message: 'Successfully created a exam.',
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

/* 
    * List exam list made by logged in user
    
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
            results[i].dataValues.problemIDList = results[i].dataValues.problemIDList.split(' ');
            examList.push({ examID: results[i].dataValues.index,
                            title: results[i].dataValues.title,
                            isDone: results[i].dataValues.isDone,
                            createdAt: results[i].dataValues.createdAt
                          });
        }
        
        res.json({
            success: true,
            message: 'Successfully listed examList',
            ecode: 200,
            data: { examList: examList }
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

/* 
    * Get problem image files by examid
    
    POST /api/exam/take
    {
        examID {Integer}
    }
*/

exports.take = async (req, res) => {
    const userid = req.token.userid;
    const { examID } = req.body;
    
    try {
        // Query by examid.
        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('That exam doesn\'t exist.');
        
        // Make a array contains problemURL
        problemList = [];
        problemIDList = exam.dataValues.problemIDList.trim().split(' ');
        
        for (let i = 0; i < problemIDList.length; i++) {
            problem =  await Problem.findOneByindex(problemIDList[i]);
            if ( problem == null ) // if the problem is removed
                continue; 
            
            problemList.push({ problemID: parseInt(problemIDList[i]),
                               problemURL: problem.dataValues.problemURL,
                               isMultipleQuestion: problem.dataValues.isMultipleQuestion
                             });
        }
        
        res.json({
            success: true,
            message: 'Successfully got exam\'s information.',
            ecode: 200,
            data: { title: exam.dataValues.title,
                    problemList: problemList }
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

/* 
    * Confirm the answer
    
    POST /api/exam/confirm/
    {
        examID {integer},
        problemIDList {array},
        answerList {array}
    }
*/

exports.confirm = async (req, res) => {
    const userid = req.token.userid;
    const { examID, problemIDList, answerList } = req.body;
    
    try {
        if ( !problemIDList || !answerList )
            throw new Error('Please enter all fields.');

        exam = await Exam.findOne({ where: { index: examID, userid: userid } });
        if ( exam == null ) 
            throw new Error('That exam doesn\'t exist.');
        
        for ( let i = 0; i < problemIDList.length; i++ ) {
            problem = await Problem.findOneByindex(problemIDList[i]);
            if ( problem == null ) 
                throw new Error('Some problem doesn\'t exist.');
    
            // if the problem's type isn't MultipleQuestion
            if ( problem.dataValues.isMultipleQuestion == false ) {
                answerPath = path.join('/uploads/answers', ['answer', Date.now() + '.jpg'].join('-'));
                fs.writeFile( path.join(__basedir, answerPath ), 
                              new Buffer(answerList[i].trim(), 'base64'), 
                              (err) => { if (err) throw err; });
                
                await Note.create({ userid: userid,
                                    examID: examID,
                                    problemID: problemIDList[i],
                                    submit: answerPath,
                                    state: Note.UNCONFIRMED,
                                    createdAt: new Date().toISOString().split('T')[0]
                                 });
            }
            else {
                state = Note.CORRECT;
                
                // if the problem's answer is wrong, write to Note db.
                if ( problem.dataValues.answer.trim() != answerList[i].trim() ) 
                    state = Note.INCORRECT;

                await Note.create({ userid: userid,
                                    examID: examID,
                                    problemID: problemIDList[i],
                                    submit: answerList[i].trim(),
                                    state: state,
                                    createdAt: new Date().toISOString().split('T')[0]
                                  });
            }
        }
        // Set isDone flag
        Exam.update({ isDone: true }, { where: { index: examID, userid: userid } });
        
        res.json({
            success: true,
            message: 'Successfully completed confirming the exam\'s answer.',
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
