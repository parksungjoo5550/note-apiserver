// Models
const Publish = require("../../../models").publish;
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collection_problem;
const Problem = require("../../../models").problem;
const Note = require("../../../models").note;

module.exports = async (req, res) => {
  const { publishId } = req.query;
  const { title, remainingTime, startPosition, state } = req.body;

  try {
    if (!publishId) throw new Error("발행을 지정해야 합니다.");

    let publish = await Publish.findOneById(publishId);
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
      if (publish.dataValues.collectionType !== "exam")
        throw new Error("시험이 아니므로 제한시간이 없습니다.");
      publish.remainingTime = remainingTime;
    }
    if (startPosition) publish.startPosition = startPosition;
    if (state) {
      // 채점하는 경우
      if (
        state === "confirmed" ||
        (state === "submitted" &&
          publish.dataValues.collectionType !== "exam")
      ) {
        let notes = await Note.findAllByPublishId(publishId);
        let problemIds = await CollectionProblem.listProblemIdByCollectionId(
          publish.dataValues.collectionId
        );
        if (notes.length !== problemIds.length)
          throw new Error("모든 문제 풀이를 저장해야 합니다.");
        notes = await Promise.all(
          notes.map(async(note) => {
            let problem = await Problem.findOneById(note.dataValues.problemId);
            if (!problem)
              throw new Error(
                "존재하지 않는 문제의 풀이는 채점할 수 없습니다."
              );
            if (note.dataValues.submit == '') throw new Error("풀이에 답안이 없어 채점할 수 없습니다.");
            if (problem.dataValues.answer == '') throw new Error("문제에 정답이 없어 채점할 수 없습니다.");
            if (note.dataValues.submit == problem.dataValues.answer)
              note.state = "correct";
            else note.state = "incorrect";
            await note.save();
            await note.reload();
            return note;
          })
        );
      } else if (state === "partial-confirmed") {
        if (publish.dataValues.collectionType === "exam") {
          throw new Error("Exam은 중간 채점을 할 수 없습니다.");
        }
        let notes = await Note.findAllByPublishId(publishId);
        notes = await Promise.all(
          notes.map(async(note) => {
            let problem = await Problem.findOneById(note.dataValues.problemId);
            if (!problem)
              throw new Error(
                "존재하지 않는 문제의 풀이는 채점할 수 없습니다."
              );
            if (note.dataValues.submit == '') throw new Error("풀이에 답안이 없어 채점할 수 없습니다.");
            if (problem.dataValues.answer == '') throw new Error("문제에 정답이 없어 채점할 수 없습니다.");
            if (note.dataValues.submit == problem.dataValues.answer)
              note.state = "correct";
            else note.state = "incorrect";
            await note.save();
            await note.reload();
            return note;
          })
        );
      }
      if (state === "submitted" &&
          publish.dataValues.collectionType !== "exam")
        publish.state = "confirmed";
      else publish.state = state;
    }

    await publish.save();
    await publish.reload();

    let message = "발행물 정보를 수정했습니다.";
    if (publish.dataValues.state === "opened") message = "발행물을 풀기 시작했습니다.";
    else if (publish.dataValues.state === "saved") message = "발행물을 중간 저장했습니다.";
    else if (publish.dataValues.state === "submitted") message = "발행물을 제출했습니다.";
    else if (publish.dataValues.state === "confirmed") message = "발행물을 채점했습니다.";
    else if (publish.dataValues.state === "partial-confirmed") message = "발행물을 중간채점했습니다.";
    
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
