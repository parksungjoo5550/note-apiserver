// Models
const Collection = require("../../../models/").collection;
const CollectionProblem = require("../../../models/").collection_problem;
const Problem = require("../../../models/").problem;
const Teacher = require("../../../models/").teacher;

module.exports = async (req, res) => {
  const reqType = req.baseUrl.slice(5);
  const { examId, homeworkId, workpaperId } = req.query;

  try {
    let optionsCollection = { where: { type: reqType } };
    let data = {};
    if (!examId && !homeworkId && !workpaperId) {
      if (req.token.type !== "admin") {
        optionsCollection.where.userId = req.token.userId;
      }
      let results = await Collection.findAll(optionsCollection);
      data[reqType] = await Promise.all(
        results.map(r => {
          let collection = r.dataValues;
          if (collection.type !== Collection.WORKPAPER) {
            let teacher = Teacher.findByUserId(collection.userId);
            if (!teacher)
              throw new Error("시험을 만든 선생이 존재하지 않습니다.");
            collection.teacher = teacher.dataValues;
          }
          let collectionProblems = CollectionProblem.findAll({
            collectionId: collection.id,
            raw: true
          });
          collection.problems = collectionProblems.map(collectionProblem => {
            let problemId = collectionProblem.problemId;
            let problem = Problem.findOneById(problemId);
            if (!problem) throw new Error("문제가 존재하지 않습니다.");
          });
          return collection;
        })
      );
    } else {
      if (reqType === "exams" && !examId) optionsCollection.id = examId;
      if (reqType === "homeworks" && !homeworkId)
        optionsCollection.id = homeworkId;
      if (reqType === "workpapers" && !workpaperId)
        optionsCollection.id = workpaperId;
      let result = await Collection.findOne(optionsCollection);
      if (!result) throw new Error("해당 컬렉션은 존재하지 않습니다.");
      data[reqType.slice(0, -1)] = result.dataValues;
    }

    res.json({
      success: true,
      message: reqType + " 조회 완료했습니다.",
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
