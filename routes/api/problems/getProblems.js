// Models
const Problem = require("../../../models").problem;
const DislikedProblem = require("../../../models").disliked_problem;
const sequelize = require("sequelize");
const Op = sequelize.Op;

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

module.exports = async (req, res) => {
  const {
    problemId,
    limit,
    random,
    isMultipleQuestion,
    source,
    course,
    bigChapter,
    middleChapter,
    smallChapter,
    startLevel,
    endLevel,
    startDate,
    endDate
  } = req.query;

  try {
    let options = { active: true };
    let _limit = 10;
    let _random = true;
    let data = {};
    if (!problemId) {
      if (limit) _limit = limit;
      if (random) _random = random === false ? false : true;
      if (isMultipleQuestion)
        options.isMultipleQuestion =
          isMultipleQuestion === "true" ? true : false;
      if (source) options.source = source;
      if (course) options.course = course;
      if (bigChapter) options.bigChapter = bigChapter;
      if (middleChapter) options.middleChapter = middleChapter;
      if (smallChapter) options.smallChapter = smallChapter;
      if (startLevel && !endLevel) {
        options.level = { [Op.gte]: startLevel };
      } else if (!startLevel && endLevel) {
        options.level = { [Op.lte]: endLevel };
      } else if (startLevel && endLevel) {
        options.level = { [Op.gte]: startLevel, [Op.lte]: endLevel };
      }
      if (startDate && !endDate) {
        options.date = { [Op.gte]: startDate };
      } else if (!startDate && endDate) {
        options.date = { [Op.lte]: endDate };
      } else if (startDate && endDate) {
        options.date = { [Op.gte]: startDate, [Op.lte]: endDate };
      }
      let results = await Problem.findAll({ where: options });
      let problems = results.map(r => {
        return r.dataValues;
      });
      // Blacklist problems excluded.
      if (req.token.type === "admin" || req.token.type === "teacher") {
        let dislikedProblems = await DislikedProblem.listByUserId(
          req.token.userId
        );
        if (dislikedProblems.length > 0) {
          let dislikedProblemIds = dislikedProblems.map(x => x.id);
          problems = problems.filter(problem => {
            return !dislikedProblemIds.includes(problem.id);
          });
        }
      }
      // limit
      if (_random === true && _limit > 0 && problems.length > _limit)
        problems = shuffle(problems).slice(0, _limit);
      data.problems = problems;
    } else {
      let problem = await Problem.findOneById(problemId);
      if (!problem) throw new Error("해당 문제는 존재하지 않습니다.");
      data.problem = problem.dataValues;
    }

    res.json({
      success: true,
      message: "문제 정보 조회를 완료했습니다.",
      ecode: 200,
      data: data
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
