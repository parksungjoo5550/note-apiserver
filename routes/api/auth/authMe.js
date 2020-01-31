// Models
const User = require("../../../models").user;
const Student = require("../../../models").student;
const Teacher = require("../../../models").teacher;

module.exports = async (req, res) => {
  try {
    let user = await User.findOneById(req.token.userId);
    if (!user) throw new Error("해당 유저는 존재하지 않습니다.");
    let data = {
      id: user.dataValues.id,
      username: user.dataValues.username,
      type: user.dataValues.type
    };
    if (user.dataValues.type === "student") {
      let student = await Student.findOneByUserId(user.dataValues.id);
      if (!student) throw new Error("해당 유저의 정보가 올바르지 않습니다.");
      data.student = student.dataValues;
    } else if (user.dataValues.type === "teacher") {
      let teacher = await Teacher.findOneByUserId(user.dataValues.id);
      if (!teacher) throw new Error("해당 유저의 정보가 올바르지 않습니다.");
      data.teacher = teacher.dataValues;
    }
    res.json({
      success: true,
      message: "해당 유저의 정보를 조회했습니다.",
      ecode: 200,
      data: data
    });
  } catch (error) {
    res.json({
      success: false,
      message: "",
      ecode: 403
    });
  }
};
