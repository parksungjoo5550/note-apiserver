// Models
const Problem = require("../../../models/").problem;
const DislikedProblem = require("../../../models/").disliked_problem;

module.exports = async (req, res) => {
  const { problemId } = req.query;
  const userId = req.token.userId;
  const userType = req.token.type;

  try {
    if (userType !== "teacher" && userType !== "admin") {
      throw new Error("문제 블랙리스트 권한이 없습니다.");
    }
    problem = await Problem.findOneById(problemId);
    if (!problem) throw new Error("해당 문제는 존재하지 않습니다.");

    await DislikedProblem.destroy({
      where: {
        userId: userId,
        problemId: problemId
      }
    });

    res.json({
      success: true,
      message: "해당 문제를 블랙리스트에서 제거하였습니다.",
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
