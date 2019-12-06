// Modules
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Models
const Category = require('../../../models/').category;

module.exports = async (req, res) => {
    const { course, bigChapter, middleChapter, smallChapter } = req.body;
    
    try {
        // List course.
        if ( !course && !bigChapter && !middleChapter && !smallChapter ) {
            categories = await Category.findAll({ where: { type: Category.COURSE }});
        }
        // List bigChapter.
        else if ( course && !bigChapter && !middleChapter && !smallChapter ) {
            categories = await Category.findAll({ where: { category: { [Op.like] : course + '$$%' },
                                                           type: Category.BIG_CHAPTER }});
        }
        // List middleChapter.
        else if ( course && bigChapter && !middleChapter && !smallChapter ) {
            categories = await Category.findAll({ where: { category: { [Op.like]: [course, bigChapter].join('$$') + '$$%' },
                                                  type: Category.MIDDLE_CHAPTER }});
        }
        // List smallChapter.
        else if ( course && bigChapter && middleChapter && !smallChapter ) {
            categories = await Category.findAll({ where: { category: { [Op.like]: [course, bigChapter, middleChapter].join('$$') + '$$%' },
                                                  type: Category.SMALL_CHAPTER }});
        }
        else {
            throw new Error('잘못된 카테고리 정보입니다.');
        }
        
        categories = categories.map(result => result.dataValues.category.split('$$').pop());

        res.json({
            success: true,
            message: '카테고리를 조회하였습니다.',
            ecode: 200,
            data: {
                categories: categories
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403,
            data: {
                categories: []
            }
        });
    }
}