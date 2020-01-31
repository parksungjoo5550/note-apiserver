// Modules
const fs = require("fs");
const path = require("path");

// Models
const Problem = require("../../../models").problem;

module.exports = async (req, res) => {
  const { problemId } = req.query;
  const {
    shortQuestionBase64,
    answer,
    course,
    bigChapter,
    middleChapter,
    smallChapter,
    level,
    source,
    date,
    active
  } = req.body;

  try {
    if (req.token.type !== "admin" && req.token.type !== "teacher")
      throw new Error("권한이 없습니다.");
    if (!problemId) throw new Error("문제를 지정해주세요.");

    let problem = await Problem.findOneById(problemId);
    if (!problem) throw new Error("해당 문제는 존재하지 않습니다.");

    let options = {};
    if (shortQuestionBase64 !== undefined) {
      let shortQuestionFilePath = problem.dataValues.shortQuestionURL;
      fs.writeFile(
        path.join(global.__basedir, shortQuestionFilePath),
        new Buffer(shortQuestionBase64, "base64"),
        err => {
          if (err) {
            res.status(403).json({
              success: false,
              message: err.message,
              ecode: 403
            });
            return;
          }
        }
      );
    }
    if (answer !== undefined) options.answer = answer;
    if (course !== undefined) options.course = course;
    if (bigChapter !== undefined) options.bigChapter = bigChapter;
    if (middleChapter !== undefined) options.middleChapter = middleChapter;
    if (smallChapter !== undefined) options.smallChapter = smallChapter;
    if (level !== undefined) options.level = level;
    if (source !== undefined) options.source = source;
    if (date !== undefined) options.date = date;
    if (active !== undefined) options.active = active;

    await Problem.update(options, { where: { index: problemId } });

    res.json({
      success: true,
      message: "문제 정보 수정하였습니다.",
      ecode: 200
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
