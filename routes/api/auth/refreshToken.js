// Modules
const jwt = require("jsonwebtoken");

// Models
const User = require("../../../models").user;

module.exports = async (req, res) => {
  try {
    let user = await User.findOneById(req.token.userId);
    if (!user) throw new Error("존재하지 않는 아이디입니다.");

    // Create a newer jwt token.
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
      message: "토큰을 재발급했습니다.",
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
