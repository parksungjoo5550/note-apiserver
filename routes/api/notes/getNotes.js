// Models
const Note = require("../../../models").note;
const Problem = require("../../../models").problem;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const { noteId, publishId, problemId, state } = req.query;

  try {
    let options = {
      where: {
        studentUserId: userId
      }
    };
    let data = {};
    if (noteId) {
      if (state) options.where.state = state;
      options.where.id = noteId;
      let note = await Note.findOne(options);
      if (!note) throw new Error("잘못된 파라미터입니다.");
      data.note = note.dataValues;
      let problem = await Problem.findOneById(note.dataValues.problemId);
      if (!problem) throw new Error("잘못된 풀이 기록입니다.");
      data.note.problem = problem.dataValues;
    } else {
      if (state) options.where.state = state;
      if (publishId) options.where.publishId = publishId;
      if (problemId) options.where.problemId = problemId;
      let notes = await Note.findAll(options);
      if (notes.length === 0)
        throw new Error("해당하는 풀이 기록이 없습니다.");
      data.notes = await Promise.all(
        notes.map(async(note) => {
          let ret = note.dataValues;
          let problem = await Problem.findOneById(ret.problemId);
          if (!problem) throw new Error("잘못된 풀이 기록입니다.");
          ret.problem = problem.dataValues;
          return ret;
        })
      );
    }

    res.json({
      success: true,
      message: "풀이 기록을 조회했습니다.",
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
