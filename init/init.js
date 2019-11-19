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
    for ( let i = 0; i < config.problem.length; i++ ) { 
        await models.Problem.create({ problemURL: config.problem[i].problemURL,
                               solutionURL: config.problem[i].solutionURL,
                               isMultipleQuestion: config.problem[i].isMultipleQuestion,
                               answer: config.problem[i].answer,
                               age: config.problem[i].age,
                               bigChapter: config.problem[i].bigChapter,
                               middleChapter: config.problem[i].middleChapter,
                               smallChapter: config.problem[i].smallChapter,
                               level: config.problem[i].level,
                               source: config.problem[i].source,
                               date: config.problem[i].date });
    }
    
    // Create a exam
    await models.Exam.create({ userid: config.user.userid, 
                        title: config.exam.title, 
                        problemIDList: config.exam.problemIDList,
                        examURL: config.exam.examURL,
                        createdAt: new Date().toISOString()
                      });
    
})();