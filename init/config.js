const path = require('path');
const config = { user: {}, problem: {}, exam: {} };

// User information
config.user.userid = 'admin';
config.user.password = '123456';
config.user.name = 'name';

// Problem information (multipleQuestion)
config.problem = [];
config.problem[0] = {};
config.problem[0].problemURL = path.join(__baseurl, '/uploads/example/problem.png');
config.problem[0].solutionURL = path.join(__baseurl, '/uploads/example/solution.png');
config.problem[0].isMultipleQuestion = false;
config.problem[0].answer = 'answer';
config.problem[0].age = 'age';
config.problem[0].bigChapter = 'bigChapter';
config.problem[0].middleChapter = 'middleChapter';
config.problem[0].smallChapter = 'smallChapter';
config.problem[0].level = 'level';
config.problem[0].source = 'source';
config.problem[0].date = new Date().toISOString();

config.problem[1] = {};
config.problem[1].problemURL = path.join(__baseurl, '/uploads/example/problem.png');
config.problem[1].solutionURL = path.join(__baseurl, '/uploads/example/solution.png');
config.problem[1].isMultipleQuestion = true;
config.problem[1].answer = 'answer2';
config.problem[1].age = 'age2';
config.problem[1].bigChapter = 'bigChapter2';
config.problem[1].middleChapter = 'middleChapter2';
config.problem[1].smallChapter = 'smallChapter2';
config.problem[1].level = 'level2';
config.problem[1].source = 'source';
config.problem[1].date = new Date().toISOString();

config.problem[2] = {};
config.problem[2].problemURL = path.join(__baseurl, '/uploads/example/problem.png');
config.problem[2].solutionURL = path.join(__baseurl, '/uploads/example/solution.png');
config.problem[2].isMultipleQuestion = true;
config.problem[2].answer = 'answer2';
config.problem[2].age = 'age2';
config.problem[2].bigChapter = 'bigChapter3';
config.problem[2].middleChapter = 'middleChapter3';
config.problem[2].smallChapter = 'smallChapter3';
config.problem[2].level = 'level3';
config.problem[2].source = 'source';
config.problem[2].date = new Date().toISOString();

// Exam information
config.exam.title = 'title';
config.exam.problemIDList = '1 2 3';
config.exam.examURL = path.join(__baseurl, '/uploads/example/pdf.pdf');

module.exports = config;