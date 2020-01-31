// Models
const User = require("../../../models").user;
const Student = require("../../../models").student;
const Teacher = require("../../../models").teacher;

module.exports = async (req, res) => {
  const { userId, username, name } = req.query;
  try {
    let userIdExists = userId && !username && !name;
    let usernameExists = !userId && username && !name;
    let nameExists = !userId && !username && name;
    let oneOfThreeExists = userIdExists + usernameExists + nameExists === 1;
    if (!userId && !username && !name) {
      if (req.token.type === "admin") {
        let users = await User.getAll();
        let data = await Promise.all(
          users.map(user => {
            if (user.type === "teacher") {
              let teacher = Teacher.findOneByUserId(user.id);
              user.teacher = !teacher ? null : teacher.dataValues;
            } else if (user.type === "student") {
              let student = Student.findOneByUserId(user.id);
              user.student = !student ? null : student.dataValues;
            }
            return user;
          })
        );
        res.json({
          success: true,
          message: "모든 유저의 정보를 조회했습니다.",
          ecode: 200,
          data: data
        });
      } else {
        let user = User.findOneById(req.token.userId);
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
      let userByUserId = await User.findOneById(userId);
      let userByUsername = await User.findOneById(username);
      let teachersByName = await Teacher.findAllByName(name);
      let studentsByName = await Student.findAllByName(name);
      if (
        !userByUserId &&
        !userByUsername &&
        teachersByName.length === 0 &&
        studentsByName.length === 0
      )
        throw new Error("존재하지 않는 계정입니다.");
      else if (teachersByName.length + studentsByName.length > 1)
        throw new Error(
          "이름이 중복되는 계정들이 있습니다. 다른 파라미터를 사용해주세요."
        );
      let user =
        userByUserId ||
        userByUsername ||
        (await User.findOneById(teachersByName[0].dataValues.userId)) ||
        (await User.findOneById(studentsByName[0].dataValues.userId));
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
        if (!student) throw new Error("해당 유저의 정보가 올바르지 않습니다.");
        data.user.student = student.dataValues;
      } else if (user.dataValues.type === "teacher") {
        let teacher = await Teacher.findOneByUserId(user.dataValues.id);
        if (!teacher) throw new Error("해당 유저의 정보가 올바르지 않습니다.");
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
      message: "",
      ecode: 403
    });
  }
};
