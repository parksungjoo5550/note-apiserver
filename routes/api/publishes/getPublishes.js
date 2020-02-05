// Models
const Collection = require("../../../models/").collection;
const CollectionProblem = require("../../../models/").collection_problem;
const Problem = require("../../../models/").problem;
const Publish = require("../../../models/").publish;
const Teacher = require("../../../models/").teacher;
const Student = require("../../../models/").student;
const User = require("../../../models/").user;

module.exports = async (req, res) => {
  const { publishId, type, state } = req.query;

  try {
    let data = {};
    if (publishId) {
      let publish = await Publish.findOneById(publishId);
      if (!publish) throw new Error("존재하지 않는 발행입니다.");
      if (req.token.type === "teacher") {
        if (publish.dataValues.teacherUserId !== req.token.userId)
          throw new Error("본인 소유의 발행만 조회할 수 있습니다.");
      } else if (req.token.type === "student") {
        if (publish.dataValues.studentUserId !== req.token.userId)
          throw new Error("본인 소유의 발행만 조회할 수 있습니다.");
      }
      data.publish = publish.dataValues;
      if (publish.dataValues.teacherUserId) {
        let teacher = await Teacher.findOneByUserId(r.dataValues.teacherUserId);
        if (!teacher) {
          let user = await User.findOneById(r.dataValues.teacherUserId);
          if (!user) throw new Error("발행을 한 선생 정보가 존재하지 않습니다.");
          if (user.dataValues.type === "admin") data.publish.user = {
            id: user.dataValues.id,
            username: user.dataValues.username,
            type: user.dataValues.type
          };
        } else {
          data.publish.teacher = {
            id: teacher.dataValues.id,
            name: teacher.dataValues.name
          }; 
        }
      }
      let student = await Student.findOneByUserId(publish.dataValues.studentUserId);
      if (!student) throw new Error("발행을 받은 학생 정보가 존재하지 않습니다.");
      data.publish.student = {
        id: student.dataValues.id,
        name: student.dataValues.name,
        admissionYear: student.dataValues.admissionYear,
        school: student.dataValues.school,
        mathGrade: student.dataValues.mathGrade,
        isRegular: student.dataValues.isRegular
      };
      let collection = await Collection.findOneById(publish.dataValues.collectionId);
      if (!collection) throw new Error("존재하지 않는 컬렉션입니다.");
      data.publish[publish.dataValues.collectionType] = collection.dataValues;
      let collection_problems = await CollectionProblem.listProblemIdByCollectionId(publish.dataValues.collectionId);
      data.publish[publish.dataValues.collectionType].problems = await Promise.all(collection_problems.map(async(r) => {
        let problem = await Problem.findOneById(r.dataValues.problemId);
        if (!problem) throw new Error("해당 문제를 찾을 수 없습니다.");
        return problem.dataValues;
      }));
    } else {
      let options = {
        where: {}
      };
      if (req.token.type === "teacher") {
        options.where.teacherUserId = req.token.userId;
      } else if (req.token.type === "student") {
        options.where.studentUserId = req.token.userId;
      }
      if (type) options.where.collectionType = type;
      if (state) options.where.state = state;

      let results = await Publish.findAll(options);
      let publishes = await Promise.all(
        results.map(async(r) => {
          let item = r.dataValues;
          if (r.dataValues.teacherUserId) {
            let teacher = await Teacher.findOneByUserId(r.dataValues.teacherUserId);
            if (!teacher) {
              let user = await User.findOneById(r.dataValues.teacherUserId);
              if (!user) throw new Error("발행을 한 선생 정보가 존재하지 않습니다.");
              if (user.dataValues.type === "admin") item.user = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                type: user.dataValues.type
              };
            } else {
              item.teacher = {
                id: teacher.dataValues.id,
                name: teacher.dataValues.name
              }; 
            }
          }
          let student = await Student.findOneByUserId(r.dataValues.studentUserId);
          if (!student) throw new Error("발행을 받은 학생 정보가 존재하지 않습니다.");
          item.student = {
            id: student.dataValues.id,
            name: student.dataValues.name,
            admissionYear: student.dataValues.admissionYear,
            school: student.dataValues.school,
            mathGrade: student.dataValues.mathGrade,
            isRegular: student.dataValues.isRegular
          };
          let collection = await Collection.findOneById(r.dataValues.collectionId);
          if (!collection) throw new Error("존재하지 않는 시험입니다.");
          if (collection.dataValues.type === Collection.EXAM) {
            item.remainingTime = r.dataValues.remainingTime;
          }
          item[collection.dataValues.type] = collection.dataValues;
          let collection_problems = await CollectionProblem.listProblemIdByCollectionId(r.dataValues.collectionId);
          item[collection.dataValues.type].problems = await Promise.all(collection_problems.map(async(r) => {
            let problem = await Problem.findOneById(r.dataValues.problemId);
            if (!problem) throw new Error("해당 문제를 찾을 수 없습니다.");
            return problem.dataValues;
          }));
          return item;
        }));
      data.publishes = publishes;
    }

    res.json({
      success: true,
      message: "발행 리스트를 조회 완료했습니다.",
      data: data,
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
