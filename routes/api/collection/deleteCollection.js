// Modules
const fs = require("fs");
const path = require("path");

// Models
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collection_problem;
const Publish = require("../../../models").publish;

module.exports = async (req, res) => {
  const reqType = req.params.collectionType;
  const { examId, homeworkId, workpaperId } = req.query;

  try {
    let optionsCollection = { where: { id: -1 } };
    let optionsPublish = { where: { collectionId: -1 } };
    if (reqType === "exams") {
      if (!examId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = examId;
      optionsPublish.where.collectionId = examId;
    } else if (reqType === "homeworks") {
      if (!homeworkId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = homeworkId;
      optionsPublish.where.collectionId = homeworkId;
    } else if (reqType === "workpapers") {
      if (!workpaperId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = workpaperId;
      optionsPublish.where.collectionId = workpaperId;
    }
    let optionsCollectionProblem = optionsPublish;

    let collection = await Collection.findOne(optionsCollection);
    if (!collection) throw new Error("컬렉션이 존재하지 않습니다.");
    if (
      collection.dataValues.userId !== req.token.userId &&
      req.token.type !== "admin"
    )
      throw new Error("삭제할 권한이 없습니다.");

    // Delete a collection's pdf file
    fs.unlink(
      path.join(global.__basedir, collection.dataValues.pdfURL),
      function(err) {
        if (err) {
          res.status(403).json({
            success: false,
            message: err.message,
            ecode: 403
          });
          return;
        }
      }
    );

    await Publish.destroy(optionsPublish);
    await CollectionProblem.destroy(optionsCollectionProblem);
    await Collection.destroy(optionsCollection);

    res.json({
      success: true,
      message: String.format("%s을 삭제했습니다.", reqType.slice(0, -1)),
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
