// Modules
const jwt = require("jsonwebtoken");

// Models
const User = require("../../../models/").user;

module.exports = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) throw new Error("모든 항목을 입력해주세요.");
    let user = await User.findOneByUsername(username);
    if (!user) throw new Error("존재하지 않는 아이디입니다.");
    if (!user.verify(password))
      throw new Error("비밀번호가 일치하지 않습니다.");

    // Create a jwt token.
    const token = await jwt.sign(
      {
        userId: user.dataValues.id,
        username: user.dataValues.username,
        type: user.dataValues.type
      },
      req.app.get("jwt-secret"),
      {
        expiresIn: "7d",
        issuer: "r4k4",
        subject: "userInfo"
      }
    );

    res.json({
      success: true,
      message: "로그인 했습니다.",
      ecode: 200,
      data: {
        token: token
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
