// Models
const models = require('../models/');

// Config
const config = require('./config.js');

// Problem 

( async function() {
    // Create a user.
    await models.User.create( { userid: config.user.userid, password: config.user.password, admin: true } );
    // Create a student.
    await models.Student.create({ userid: config.user.userid, name: config.user.name });
    // Create a problem.
    await models.Problem.create({ problemURL: config.problem.problemURL,
                           solutionURL: config.problem.solutionURL,
                           isMultipleQuestion: config.problem.isMultipleQuestion,
                           answer: config.problem.answer,
                           age: config.problem.age,
                           bigChapter: config.problem.bigChapter,
                           middleChapter: config.problem.middleChapter,
                           smallChapter: config.problem.smallChapter,
                           level: config.problem.level,
                           source: config.problem.source,
                           date: config.problem.date });
    // Create a exam
    await models.Exam.create({ userid: config.user.userid, 
                        title: config.exam.title, 
                        problemList: config.exam.problemList,
                        examURL: config.exam.examURL,
                        createdAt: new Date().toISOString()
                      });
    
})();