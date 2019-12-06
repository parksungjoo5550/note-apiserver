// Models
const Category = require('../../../models/').category;

module.exports = async (req, res) => {
    const { course, bigChapter, middleChapter, smallChapter } = req.body;
    
    try {
        category = ( course ? course +
                                ( bigChapter ? '$$' + bigChapter : '') +
                                ( middleChapter ? '$$' + middleChapter : '') +
                                ( smallChapter ? '$$' + smallChapter : ''): '');
        
        if ( category == '' )
            throw new Error('카테고리를 입력해주세요.');
        
        categories = category.split('$$');
        if (categories.length > 4 )
            throw new Error('잘못된 카테고리 정보입니다.');
        
        parentCategory = categories.slice(0,3);
        result = await Category.findOne({ where: {category: parentCategory.join('$$'), type: parentCategory.length }});
        if ( result == null )
            throw new Error('상위 카테고리 먼저 입력해주세요.');
        
        result = await Category.findOne({ where: {category: category, type: categories.length }});
        if ( result )
            throw new Error('이미 존재하는 카테고리입니다.');
        
        await Category.create({ category: category, type: categories.length });
        
        res.json({
            success: true,
            message: '카테고리를 생성하였습니다.',
            ecode: 200
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}