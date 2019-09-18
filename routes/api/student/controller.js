const Student = require('../../../models/student');

/* 
    * Set student's information
    
    POST /api/student/set
    {
        name,
        school,
        classOf,
        mathGrade
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
            await Student.update({userid: userid}, {name: name, school: school, classOf: classOf, mathGrade: mathGrade});
        }
        else {
            await Student.create(userid, name, school, classOf, mathGrade);
        }
        res.json({
           message: 'success' 
        });
    }
    catch (error) {
        res.status(403).json({
            message: error.message
        });
    }
}

/* 
    * View student's information
    
    POST /api/student/view
    {
        
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
                name: student.name,
                school: student.school,
                classOf: student.classOf,
                mathGrade: student.mathGrade
            });
        }
    }
    catch (error) {
        res.status(403).json({
            message: error.message
        });
    }
}