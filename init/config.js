const path = require('path');
const config = { user: {}, problem: {}, exam: {} };

// User information
config.user.userid = 'admin';
config.user.password = '123456';
config.user.name = 'name';

// Problem information
config.problem.problemURL = '/uploads/example/problem.png';
config.problem.solutionURL = '/uploads/example/solution.png';
config.problem.isMultipleQuestion = false;
config.problem.answer = 'answer';
config.problem.age = 'age';
config.problem.bigChapter = 'bigChapter';
config.problem.middleChapter = 'middleChapter';
config.problem.smallChapter = 'smallChapter';
config.problem.level = 'level';
config.problem.source = 'source';
config.problem.date = new Date().toISOString();

// Exam information
config.exam.title = 'title';
config.exam.problemIDList = '1 2';
config.exam.examURL = '/uploads/example/pdf.pdf';

module.exports = config;