// Modules
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

// Models
const Exam = require('../../../models/').exam;
const Problem = require('../../../models/').problem;

/* 
    * Create a exam
    
    POST /api/exam/create
    {
        title            {string},
        problemIDList    {Array},
        timeLimit        {Integer}
    }
*/

module.exports = async (req, res) => {
    const userid = req.token.userid;
    const { title, problemIDList, timeLimit } = req.body;
    
    try {
        if ( !title || !problemIDList )
            throw new Error('모든 항목을 입력해주세요.');

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
                throw new Error(`${problemIDList2[0]}번 문제는 존재하지 않습니다.`);
            
            problemIDList2.shift();
            doc.image(path.join(__basedir, problem.dataValues.problemURL), 10, 50, 
                         { width: doc.page.width/2 - 20 });

            // Image 2
            if ( problemIDList2.length > 0 ) {
                problem = await Problem.findOneByindex(problemIDList2[0]);
                if ( problem == null )
                    throw new Error(`${problemIDList2[0]}번 문제는 존재하지 않습니다.`);
                
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
        
        await Exam.create({ userid: userid, 
                            title: title, 
                            problemIDList: problemIDList.join(' '),
                            examURL: examURL,
                            timeLimit: timeLimit == undefined ? 0 : timeLimit,
                            createdAt: new Date().toISOString().substring(0, 19).replace('T',' ')
                         });
        res.json({
            success: true,
            message: '새로운 시험지를 생성했습니다.',
            ecode: 200
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