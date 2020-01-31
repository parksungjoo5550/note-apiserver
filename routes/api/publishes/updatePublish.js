// Models
const Publish = require("../../../models").publish;
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collection_problem;
const Problem = require("../../../models").problem;
const Note = require("../../../models").note;

module.exports = async (req, res) => {
  const { publishId } = req.query;
  const { title, remainingTime, state } = req.body;

  try {
    if (!publishId) throw new Error("발행을 지정해야 합니다.");

    let publish = await Publish.findOne({ where: { id: publishId } });
    if (!publish) throw new Error("발행이 존재하지 않습니다.");

    if (req.token.type === "student") {
      if (publish.dataValues.studentUserId !== req.token.userId)
        throw new Error("권한이 없습니다.");
    } else if (req.token.type === "teacher") {
      if (publish.dataValues.teacherUserId !== req.token.userId)
        throw new Error("권한이 없습니다.");
    }
    let collection = await Collection.findOneById(
      publish.dataValues.collectionId
    );
    if (!collection) throw new Error("존재하지 않는 시험입니다.");
    if (title) publish.title = title;
    if (remainingTime) {
      if (collection.dataValues.type !== "exam")
        throw new Error("시험이 아니므로 제한시간이 없습니다.");
      publish.remainingTime = remainingTime;
    }
    if (state) {
      // 채점하는 경우
      if (
        state === Publish.CONFIRMED ||
        (state === Publish.SUBMITTED &&
          collection.dataValues.type !== Collection.EXAM)
      ) {
        let notes = await Note.findAllByPublishId(publishId);
        let problemIds = await CollectionProblem.listProblemIdByCollectionId(
          publish.dataValues.collectionId
        );
        if (notes.length !== problemIds.length)
          throw new Error("모든 문제 풀이를 저장해야 합니다.");
        await Promise.all(
          notes.forEach(note => {
            let problem = Problem.findOneById(note.dataValues.problemId);
            if (!problem)
              throw new Error(
                "존재하지 않는 문제의 풀이는 채점할 수 없습니다."
              );
            if (note.dataValues.submit === problem.dataValues.answer)
              note.state = Note.CORRECT;
            else note.state = Note.INCORRECT;
            note.save();
          })
        );
      }
      publish.state = state;
    }

    await publish.save();

    let message = "발행물 정보를 수정했습니다.";
    if (state === Publish.OPENED) message = "발행물을 풀기 시작했습니다.";
    else if (state === Publish.SAVED) message = "발행물을 중간 저장했습니다.";
    else if (state === Publish.SUBMITTED) message = "발행물을 제출했습니다.";
    else if (state === Publish.CONFIRMED) message = "발행물을 채점했습니다.";

    res.json({
      success: true,
      message: message,
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
