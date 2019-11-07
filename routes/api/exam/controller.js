// Modules
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

// Models
const Exam = require('../../../models/').Exam;
const Problem = require('../../../models/').Problem;

/* 
    * Create a exam paper
    
    POST /api/exam/create
    {
        title     {string},
        problemList  {Array}
    }
*/

exports.create = async (req, res) => {
    const userid = req.token.userid;
    const { title, problemList } = req.body;
    
    try {
        if ( !title || !problemList ) {
            throw new Error('Please enter all fields.');
        }
        else {
            problemList2 = problemList;
            
            // Create a PDF file.
            doc = new pdfDocument();
            examURL = path.join("/uploads", ["pdf", Date.now() + '.pdf'].join('-'));
            
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
                problem = await Problem.findOne({ where: { index: problemList2.shift() } });
                doc.image(path.join(__basedir, problem.dataValues.problemURL), 10, 50, 
                          { width: doc.page.width/2 - 20 });
   
                // Image 2
                if ( problemList2.length > 0 ) {
                    problem = await Problem.findOne({ where: { index: problemList2.shift() } });
                    doc.image(path.join(__basedir, problem.dataValues.problemURL), doc.page.width/2 + 10, 50,
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
        }
        
        res.json({
            success: 'true',
            message: 'Successfully created a exam paper.',
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
        papers = [];
        
        // Make a array contains problemList.
        for (let i = 0; i < results.length; i++){
            results[i].dataValues.problemList = results[i].dataValues.problemList.split(' ');
            papers.push({ examid: results[i].dataValues.index,
                          title: results[i].dataValues.title,
                          createdAt: results[i].dataValues.createdAt
                        });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed papers',
            ecode: 200,
            data: { papers: papers }
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
    
    POST /api/exam/:examid
    {
        * not required *
    }
*/

exports.get = async (req, res) => {
    const examid = req.params.examid;
    
    try {
        // Query by examid.
        result = await Exam.findOne({ where: { index: examid } });
        
        // Make a array contains problemURL
        problems = [];
        problemList = result.dataValues.problemList.trim().split(' ');
        
        for (let i = 0; i < problemList.length; i++){
            problem = await Problem.findOne({ where: { index: problemList[i] } });
            problems.push({ problemID: problemList[i], problemURL: problem.dataValues.problemURL });
        }
        
        res.json({
            success: 'true',
            message: 'Successfully listed papers',
            ecode: 200,
            data: { title: result.dataValues.title,
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
