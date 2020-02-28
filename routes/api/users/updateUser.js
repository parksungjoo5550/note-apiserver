// Models
const User = require("../../../models").user;
const Teacher = require("../../../models").teacher;
const Student = require("../../../models").student;

module.exports = async (req, res) => {
  const { userId, username, name } = req.query;
  const { password, password2, teacher, student } = req.body;

  try {
    let userIdExists = userId && !username && !name;
    let usernameExists = !userId && username && !name;
    let nameExists = !userId && !username && name;
    let oneOfThreeExists = userIdExists + usernameExists + nameExists === 1;
    if (req.token.type !== "admin" || req.token.type !== "teacher") {
      if (!oneOfThreeExists) throw new Error("하나의 파라미터만 입력해주세요.");
      if (!password) throw new Error("비밀번호를 입력해주세요.");
      let userEqual = true;
      if (userIdExists) userEqual = userId === req.token.userId;
      if (usernameExists) userEqual = username === req.token.username;
      if (nameExists) userEqual = name === req.token[req.token.type].name;
      if (userEqual !== true)
        throw new Error("본인 계정만 수정할 수 있습니다.");
    }

    let userByUserId = null;
    let userByUsername = null;
    let teacherByName = null;
    let studentByName = null;
    if (userIdExists) userByUserId = await User.findOneById(userId);
    if (usernameExists) userByUsername = await User.findOneByUsername(username);
    if (nameExists) {
      teacherByName = await Teacher.findOneByName(name);
      studentByName = await Student.findOneByName(name);
    }
    if (
      !userByUserId &&
      !userByUsername &&
      !teacherByName &&
      !studentByName
    )
      throw new Error("존재하지 않는 계정입니다.");
    else if (teacherByName && studentByName)
      throw new Error(
        "이름이 중복되는 학생과 선생이 있습니다. 다른 파라미터를 사용해주세요."
      );
    let teacherUser = null;
    let studentUser = null;
    if (teacherByName) teacherUser = await User.findOneById(teacherByName.dataValues.teacherUserId);
    if (studentByName) studentUser = await User.findOneById(studentByName.dataValues.studentUserId);
    let user =
      userByUserId ||
      userByUsername ||
      teacherUser ||
      studentUser;
    if (user === null || user === undefined)
      user = await User.findOneById(req.token.userId);
    if (!user) throw new Error("해당 유저는 존재하지 않습니다.");
    if (password && password2 && password === password2) {
      user.password = password;
      await user.save();
    } else if (student) {
      let _student = await Student.findOneByUserId(user.id);
      if (!_student) throw new Error("해당 계정에 학생 정보가 없습니다.");
      Object.keys(student).forEach(value => {
        _student[value] = student[value];
      });
      await _student.save();
    } else if (teacher) {
      let _teacher = await Teacher.findOneByUserId(user.id);
      if (!_teacher) throw new Error("해당 계정에 선생 정보가 없습니다.");
      Object.keys(teacher).forEach(value => {
        _teacher[value] = teacher[value];
      });
      await _teacher.save();
    } else {
      throw new Error("잘못된 파라미터입니다.");
    }
    res.json({
      success: true,
      message: "User를 수정했습니다.",
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
