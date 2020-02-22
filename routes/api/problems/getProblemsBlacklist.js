// Models
const Problem = require("../../../models/").problem;
const DislikedProblem = require("../../../models/").disliked_problem;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const userType = req.token.type;

  try {
    if (userType !== "teacher" && userType !== "admin") {
      throw new Error("문제 블랙리스트 권한이 없습니다.");
    }

    let results = await DislikedProblem.listByUserId(userId);
    let data = {
      problems: []
    };
    data.problems = await Promise.all(
      results.map(async(r) => {
        let problemId = r.dataValues.problemId;
        let problem = await Problem.findOneById(problemId);
        return problem.dataValues;
      })
    );

    res.json({
      success: true,
      message: "블랙리스트 문제들을 조회했습니다.",
      data: data,
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
