// Modules
const fs = require("fs");
const path = require("path");

// Models
const Problem = require("../../../models").problem;

module.exports = async (req, res) => {
  const {
    problemFilename,
    solutionFilename,
    shortQuestionFilename,
    problemBase64,
    solutionBase64,
    shortQuestionBase64,
    isMultipleQuestion,
    answer,
    course,
    bigChapter,
    middleChapter,
    smallChapter,
    level,
    source,
    date
  } = req.body;

  try {
    if (req.token.type !== "admin" && req.token.type !== "teacher")
      throw new Error("권한이 없습니다.");
    if (!problemFilename || !problemBase64 || !isMultipleQuestion)
      throw new Error("모든 항목을 입력해주세요.");

    // Save Problem and Solution file.
    let problemFilePath = path.join("/uploads/problems", problemFilename);
    fs.writeFile(
      path.join(global.__basedir, problemFilePath),
      new Buffer(problemBase64, "base64"),
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

    let solutionFilePath = null;
    if (solutionFilename != undefined) {
      solutionFilePath = path.join("/uploads/solutions", solutionFilename);
      fs.writeFile(
        path.join(global.__basedir, solutionFilePath),
        new Buffer(solutionBase64, "base64"),
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

    let shortQuestionFilePath = null;
    if (shortQuestionBase64 !== undefined) {
      shortQuestionFilePath = path.join(
        "/uploads/problems",
        shortQuestionFilename
      );
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

    await Problem.create({
      problemURL: problemFilePath,
      solutionURL: solutionFilePath,
      shortQuestion: shortQuestionFilePath,
      isMultipleQuestion: isMultipleQuestion == "true" ? true : false,
      answer: answer,
      course: course,
      bigChapter: bigChapter,
      middleChapter: middleChapter,
      smallChapter: smallChapter,
      level: level,
      source: source,
      date: date
    });

    res.json({
      success: true,
      message: "새로운 문제를 생성하였습니다.",
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
