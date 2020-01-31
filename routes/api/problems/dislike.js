// Models
const Problem = require("../../../models/").problem;
const User = require("../../../models/").user;
const DislikedProblem = require("../../../models/").disliked_problem;

module.exports = async (req, res) => {
  const { problemID } = req.body;
  const userid = req.token.userid;

  try {
    problem = await Problem.findOneByindex(problemID);
    if (problem == null) throw new Error("해당 문제는 존재하지 않습니다.");
    user = await User.findOneByUserid(userid);
    if (user == null) throw new Error("해당 유저는 존재하지 않습니다.");

    await DislikedProblem.create({
      user_id: userid,
      problem_id: problemID
    });

    res.json({
      success: true,
      message: "해당 문제를 블랙리스트에 추가하였습니다.",
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
