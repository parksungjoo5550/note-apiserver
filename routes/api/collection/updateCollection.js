// Modules
const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

// Models
const Student = require("../../../models").student;
const Problem = require("../../../models").problem;
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collection_problem;

module.exports = async (req, res) => {
  const reqType = req.params.collectionType;
  const { examId, homeworkId, workpaperId } = req.query;
  const { title, problemIds, timeLimit } = req.body;

  try {
    let optionsCollection = { where: { id: -1 } };
    let optionsCollectionProblem = { where: { collectionId: -1 } };
    if (reqType === "exams") {
      if (!examId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = examId;
      optionsCollectionProblem.where.collectionId = examId;
    } else if (reqType === "homeworks") {
      if (!homeworkId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = homeworkId;
      optionsCollectionProblem.where.collectionId = homeworkId;
    } else if (reqType === "workpapers") {
      if (!workpaperId) throw new Error("항목을 입력해주세요.");
      optionsCollection.where.id = workpaperId;
      optionsCollectionProblem.where.collectionId = workpaperId;
    }

    let collection = await Collection.findOne(optionsCollection);
    if (!collection) throw new Error("컬렉션이 존재하지 않습니다.");
    // Non-regular student can't update collection.
    if (req.token.type === "student") {
      let student = await Student.findOneByUserId(req.token.userId);
      if (!student) throw new Error("잘못된 계정입니다.");
      else {
        if (student.dataValues.isRegular == false)
          throw new Error("권한이 없습니다.");
      }
    }
    if (!title || !problemIds || (reqType === "exams" && !timeLimit))
      throw new Error("모든 항목을 입력해주세요.");

    let problemIds2 = Array.from(new Set(problemIds));

    // Create a PDF file.
    let doc = new pdfDocument();
    let pdfURL = path.join(
      "/uploads/pdfs",
      ["pdf", Date.now() + ".pdf"].join("-")
    );

    doc.pipe(fs.createWriteStream(path.join(global.__basedir, pdfURL)));

    // Draw Title.
    doc.fontSize(30);
    doc.text(title, 0, 10, { width: doc.page.width, align: "center" });

    // Make a page contain 2 images.
    let pageNumber = 1;

    while (problemIds.length > 0) {
      // Footer
      doc.fontSize(12);
      doc.page.margins.bottom = 0;
      doc.text(
        `- ${pageNumber} -`,
        0.5 * (doc.page.width - 100),
        doc.page.height - 40,
        {
          width: 100,
          align: "center",
          lineBreak: false
        }
      );

      // Vertical line
      doc
        .moveTo(doc.page.width / 2, 50)
        .lineTo(doc.page.width / 2, doc.page.height - 50)
        .stroke();

      // Image 1
      let problem = await Problem.findOneByindex(problemIds2[0]);
      if (problem == null || problem.dataValues.active == false)
        throw new Error(`${problemIds[0]}번 문제는 이용할 수 없습니다.`);

      problemIds2.shift();
      doc.image(
        path.join(global.__basedir, problem.dataValues.problemURL),
        10,
        50,
        {
          width: doc.page.width / 2 - 20
        }
      );

      // Image 2
      if (problemIds2.length > 0) {
        problem = await Problem.findOneByindex(problemIds[0]);
        if (problem == null || problem.dataValues.active == false)
          throw new Error(`${problemIds2[0]}번 문제는 이용할 수 없습니다.`);

        problemIds2.shift();
        doc.image(
          path.join(global.__basedir, problem.dataValues.problemURL),
          doc.page.width / 2 + 10,
          50,
          { width: doc.page.width / 2 - 20 }
        );
      }

      if (problemIds2.length == 0) break;

      doc.addPage();
      pageNumber++;
    }

    doc.end();

    let options = {};
    options.pdfURL = pdfURL;
    options.timeLimit = timeLimit == undefined ? 0 : timeLimit;
    if (title !== undefined) options.title = title;

    // DB
    await collection.update({
      userId: req.token.userId,
      title: title,
      pdfURL: pdfURL,
      timeLimit: timeLimit == undefined ? 0 : timeLimit,
      type: reqType.slice(0, -1),
      createdAt: new Date()
        .toISOString()
        .substring(0, 19)
        .replace("T", " ")
    });
    await CollectionProblem.destroy(optionsCollectionProblem);
    await CollectionProblem.bulkCreate(
      problemIds2.map(problemId => {
        return {
          collectionId: collection.dataValues.id,
          problemId: problemId
        };
      })
    );

    res.json({
      success: true,
      message: String.format("%s을 수정했습니다.", reqType.slice(0, -1)),
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
