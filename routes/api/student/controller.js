const Student = require('../../../models/').Student;

/* 
    * Set student's information
    
    POST /api/student/set
    {
        name              {string},
        school            {string},
        admissionYear     {string},
        mathGrade         {string}
    }
*/

exports.set = async (req, res) => {
    const userid = req.token.userid;
    const { name, school, admissionYear, mathGrade } = req.body;
   
    try {
        let options = {};
        
        if ( name !== undefined && name !== '' )
            options.name = name;
        if ( school !== undefined && school !== '' )
            options.school = school;
        if ( admissionYear !== undefined && admissionYear !== '' )
            options.admissionYear = admissionYear;
        if ( mathGrade !== undefined && mathGrade !== '' )
            options.mathGrade = mathGrade;
        
        if ( await Student.findOneByUserid(userid) )
            await Student.update(options, { where: { userid: userid } });
        else
            throw new Error('Some errors occur in /api/student/set api. (Report to admin)');
        
        res.json({
            success: true,
            message: 'Successfully set user information.',
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
    * View student's information
    
    POST /api/student/view
    {
        * not required *
    }
*/

exports.view = async (req, res) => {
    const userid = req.token.userid;
    
    try {
        student = await Student.findOneByUserid(userid);
        
        if (student == null){
            throw new Error('Some errors occur in /api/student/view api. (Report to admin)');
        }
        else {
            res.json({
                success: true,
                message: 'Successfully view user information.',
                ecode: 200,
                data: {
                    name: student.dataValues.name,
                    school: student.dataValues.school,
                    admissionYear: student.dataValues.admissionYear,
                    mathGrade: student.dataValues.mathGrade
                }
            });
        }
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}