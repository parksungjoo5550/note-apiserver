// Models
const User = require("../../../models").user;
const Student = require("../../../models").student;
const Teacher = require("../../../models").teacher;

module.exports = async (req, res) => {
  const { userId, username, name, type, abandoned, teacherUserId } = req.query;
  try {
    let userIdExists = userId && !username && !name;
    let usernameExists = !userId && username && !name;
    let nameExists = !userId && !username && name;
    let oneOfThreeExists = userIdExists + usernameExists + nameExists === 1;
    if (!userId && !username && !name) {
      if (req.token.type === "admin" || req.token.type === "teacher") {
        let optionsUser = { where: {} };
        if (type) optionsUser.where.type = type;
        let users = await User.findAll(optionsUser);
        let data = {};
        data.users = await Promise.all(
          users.map(async(user) => {
            let item = user.dataValues;
            if (user.dataValues.type === "teacher") {
              let teacher = await Teacher.findOneByUserId(user.dataValues.id);
              item.teacher = !teacher ? null : teacher.dataValues;
            } else if (user.dataValues.type === "student") {
              let student = await Student.findOneByUserId(user.dataValues.id);
              item.student = !student ? null : student.dataValues;
            }
            return item;
          })
        );
        if (type === "student") {
          if (abandoned === "true") {
            data.users = data.users.filter(item => !item.student.teacherUserId);
          } else if (abandoned === "false") {
            data.users = data.users.filter(item => item.student.teacherUserId);
          }
          if (!teacherUserId) {
            data.users = data.users.filter(item => item.student.teacherUserId == teacherUserId);
          }
        }
        res.json({
          success: true,
          message: "모든 유저의 정보를 조회했습니다.",
          ecode: 200,
          data: data
        });
      } else {
        let user = await User.findOneById(req.token.userId);
        if (!user) throw new Error("해당 유저는 존재하지 않습니다.");
        let data = {
          user: {
            id: user.dataValues.id,
            username: user.dataValues.username,
            type: user.dataValues.type
          }
        };
        if (user.dataValues.type === "student") {
          let student = await Student.findOneByUserId(user.dataValues.id);
          if (!student)
            throw new Error("해당 유저의 정보가 올바르지 않습니다.");
          data.user.student = student.dataValues;
        } else if (user.dataValues.type === "teacher") {
          let teacher = await Teacher.findOneByUserId(user.dataValues.id);
          if (!teacher)
            throw new Error("해당 유저의 정보가 올바르지 않습니다.");
          data.user.teacher = teacher.dataValues;
        }
        res.json({
          success: true,
          message: "본인의 유저 정보를 조회했습니다.",
          ecode: 200,
          data: data
        });
      }
    } else {
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
      let data = {
        user: {
          id: user.dataValues.id,
          username: user.dataValues.username,
          type: user.dataValues.type
        }
      };
      if (user.dataValues.type === "student") {
        let student = await Student.findOneByUserId(user.dataValues.id);
        if (!student)
          throw new Error("해당 유저의 정보가 올바르지 않습니다.");
        data.user.student = student.dataValues;
      } else if (user.dataValues.type === "teacher") {
        let teacher = await Teacher.findOneByUserId(user.dataValues.id);
        if (!teacher)
          throw new Error("해당 유저의 정보가 올바르지 않습니다.");
        data.user.teacher = teacher.dataValues;
      }
      res.json({
        success: true,
        message: "유저 정보를 조회했습니다.",
        ecode: 200,
        data: data
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
