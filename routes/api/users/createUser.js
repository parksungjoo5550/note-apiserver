// Models
const User = require("../../../models").user;
const Teacher = require("../../../models").teacher;
const Student = require("../../../models").student;

module.exports = async (req, res) => {
  const {
    username,
    password,
    password2,
    type,
    name,
    school,
    admissionYear,
    mathGrade
  } = req.body;

  try {
    if (
      !username ||
      !password ||
      !password2 ||
      !type ||
      (type === "teacher" && !name) ||
      (type === "student" && (!name || !school || !admissionYear || !mathGrade))
    ) {
      throw new Error("모든 항목을 입력해주세요.");
    } else if (password !== password2) {
      throw new Error("확인 비밀번호가 일치하지 않습니다.");
    } else if (password.length < 6) {
      throw new Error("비밀번호가 최소 6자리 이상이여야 합니다.");
    } else if (await User.findOneByUsername(username)) {
      throw new Error("이미 존재하는 아이디입니다.");
    } else if (type !== "teacher" && type !== "student") {
      throw new Error("올바르지 않은 입력입니다.");
    }

    // Create a user.
    let user = await User.create({
      username: username,
      password: password,
      type: type
    });
    // Write additional information by type.
    if (type === "teacher") {
      await Teacher.create({
        userId: user.dataValues.id,
        name: name
      });
    } else if (type === "student") {
      await Student.create({
        userId: user.dataValues.id,
        name: name,
        school: school,
        admissionYear: admissionYear,
        mathGrade: mathGrade
      });
    }
    res.json({
      success: true,
      message: "User를 생성했습니다.",
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
