// Modules
const jwt = require("jsonwebtoken");

// Models
const User = require("../../../models/").user;
const Student = require("../../../models/").student;
const Teacher = require("../../../models/").teacher;

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
    
    let data = {};
    data.token = token;
    data.user = {
      id: user.dataValues.id,
      username: user.dataValues.username,
      type: user.dataValues.type
    };
    
    if (user.dataValues.type === "teacher") {
      let teacher = await Teacher.findOneByUserId(user.dataValues.id);
      if (!teacher) throw new Error("선생 정보가 존재하지 않습니다.");
      data.user.teacher = teacher.dataValues;
    } else if (user.dataValues.type === "student") {
      let student = await Student.findOneByUserId(user.dataValues.id);
      if (!student) throw new Error("학생 정보가 존재하지 않습니다.");
      data.user.student = student.dataValues;
    }

    res.json({
      success: true,
      message: "로그인 했습니다.",
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
