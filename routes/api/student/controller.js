const Student = require('../../../models/').Student;

/* 
    * Set student's information
    
    POST /api/student/set
    {
        name        {string},
        school      {string},
        classOf     {integer},
        mathGrade   {integer}
    }
*/

exports.set = async (req, res) => {
    const userid = req.token.userid;
    const { name, school, classOf, mathGrade } = req.body;
   
    try {
        if ( !name || !school || !classOf || !mathGrade ) {
            throw new Error('Please enter all fields.');
        }
        else if ( await Student.findOneByUserid(userid) ) { // If the student already exist.
            await Student.update({ name: name, school: school, classOf: classOf, mathGrade: mathGrade },
                                 { where: { userid: userid } });
        }
        else {
            await Student.create({ userid: userid, name: name, school: school, classOf: classOf, mathGrade: mathGrade });
        }
        res.json({
            success: 'true',
            message: 'Successfully set user information.',
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
            throw new Error('Please set your information.');
        }
        else {
            res.json({
                success: 'true',
                message: 'Successfully view user information.',
                ecode: 200,
                data: {
                    name: student.dataValues.name,
                    school: student.dataValues.school,
                    classOf: student.dataValues.classOf,
                    mathGrade: student.dataValues.mathGrade
                }
            });
        }
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}