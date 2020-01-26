// Modules
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

// Models
const Student = require('../../../models/').student;
const Problem = require('../../../models/').problem;
const Collection = require('../../../models/').collection;
const CollectionProblem = require('../../../models').collection_problem;

/* 
    * Create a collection
    
    POST /api/collection/create
    {
        title            {String},
        problemIDList    {Array},
        timeLimit        {Integer},
        type             {String}
    }
*/

module.exports = async (req, res) => {
    const token = req.token;
    const { title, problemIDList, timeLimit, type } = req.body;
    
    try {
        // Non-regular student can't create collection.
        if ( token.type === 'student' ) {
            student = await Student.findOneByUserid(token.userid);
            if ( student == null )
                throw new Error('잘못된 계정입니다.');
            else {
                if ( student.dataValues.isRegular == false )
                    throw new Error('권한이 없습니다.');
            }
        }
        if ( !title || !problemIDList || !type )
            throw new Error('모든 항목을 입력해주세요.');

        problemIDList2 = Array.from(new Set(problemIDList));

        // Create a PDF file.
        doc = new pdfDocument();
        collectionURL = path.join("/uploads/pdfs", ["pdf", Date.now() + '.pdf'].join('-'));
            
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
            if ( problem == null || problem.dataValues.active == false )
                    throw new Error(`${problemIDList2[0]}번 문제는 이용할 수 없습니다.`);
            
            problemIDList2.shift();
            doc.image(path.join(__basedir, problem.dataValues.problemURL), 10, 50, 
                         { width: doc.page.width/2 - 20 });

            // Image 2
            if ( problemIDList2.length > 0 ) {
                problem = await Problem.findOneByindex(problemIDList2[0]);
                if ( problem == null || problem.dataValues.active == false )
                    throw new Error(`${problemIDList2[0]}번 문제는 이용할 수 없습니다.`);
                
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
        
        // DB
        Collection.create({
            userid: token.userid, 
            title: title, 
            collectionURL: collectionURL,
            timeLimit: timeLimit == undefined ? 0 : timeLimit,
            type: type == 'workbook' ? Collection.WORKBOOK : Collection.WORKPAPER[type],
            createdAt: new Date().toISOString().substring(0, 19).replace('T',' ')
        }).then(result => CollectionProblem.bulkCreate(problemIDList2.map(problemID => {
            return {
                collectionID: result.id,
                problemID: problemID
            };
        })));

        res.json({
            success: true,
            message: String.format('새로운 %s을 생성했습니다.', type),
            ecode: 200
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}
