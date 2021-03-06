// Models
const Collection = require("../../../models/").collection;
const CollectionProblem = require("../../../models/").collection_problem;
const Problem = require("../../../models/").problem;
const Teacher = require("../../../models/").teacher;

module.exports = async (req, res) => {
  const reqType = req.baseUrl.slice(5);
  const { examId, homeworkId, workpaperId, workbookId } = req.query;

  try {
    let optionsCollection = { where: { type: reqType.slice(0, -1) } };
    let data = {};
    if (!examId && !homeworkId && !workpaperId) {
      if (req.token.type !== "admin") {
        optionsCollection.where.userId = req.token.userId;
      }
      let results = await Collection.findAll(optionsCollection);
      data[reqType] = await Promise.all(
        results.map(async(r) => {
          let collection = r.dataValues;
          if (collection.type !== Collection.WORKPAPER && collection.type !== Collection.WORKBOOK) {
            let teacher = Teacher.findOneByUserId(collection.userId);
            if (!teacher)
              throw new Error("시험을 만든 선생이 존재하지 않습니다.");
            collection.teacher = teacher.dataValues;
          }
          let collectionProblems = await CollectionProblem.listProblemIdByCollectionId(collection.id);
          collection.problems = await Promise.all(collectionProblems.map(async(collectionProblem) => {
            let problemId = collectionProblem.dataValues.problemId;
            let problem = await Problem.findOneById(problemId);
            if (!problem) throw new Error("문제가 존재하지 않습니다.");
            return problem.dataValues;
          }));
          return collection;
        })
      );
    } else {
      if (reqType === "exams" && examId) optionsCollection.where.id = examId;
      if (reqType === "homeworks" && homeworkId)
        optionsCollection.where.id = homeworkId;
      if (reqType === "workpapers" && workpaperId)
        optionsCollection.where.id = workpaperId;
      if (reqType === "workbooks" && workbookId)
        optionsCollection.where.id = workbookId;
      let result = await Collection.findOne(optionsCollection);
      if (!result) throw new Error("해당 컬렉션은 존재하지 않습니다.");
      data[reqType.slice(0, -1)] = result.dataValues;
      if (result.dataValues.type !== Collection.WORKPAPER && result.dataValues.type !== Collection.WORKBOOK) {
        let teacher = Teacher.findOneByUserId(collection.userId);
        if (!teacher)
          throw new Error("시험을 만든 선생이 존재하지 않습니다.");
        data[reqType.slice(0, -1)].teacher = teacher.dataValues;
      }
      let collectionProblems = await CollectionProblem.listProblemIdByCollectionId(optionsCollection.where.id);
      data[reqType.slice(0, -1)].problems = await Promise.all(collectionProblems.map(async(collectionProblem) => {
        let problemId = collectionProblem.problemId;
        let problem = await Problem.findOneById(problemId);
        if (!problem) throw new Error("문제가 존재하지 않습니다.");
        return problem.dataValues;
      }));
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
