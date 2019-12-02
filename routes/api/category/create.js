// Models
const Category = require('../../../models/').category;

module.exports = async (req, res) => {
    const { bigChapter, middleChapter, smallChapter } = req.body;
    
    try { 
        category = ( bigChapter ? bigChapter + '$$' + ( middleChapter ? middleChapter + '$$': '') + ( smallChapter ? smallChapter + '$$' : ''): '');
        if ( category == '' )
            throw new Error('카테고리를 입력해주세요.');
        
        console.log(category);
        category = category.slice(0, -2);
        categories = category.split('$$');
        if (categories.length > 3 )
            throw new Error('잘못된 카테고리 정보입니다.');
        

        await Category.create({ category: category, type: categories.length });
        
        res.json({
            success: true,
            message: '카테고리를 생성하였습니다.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: error.message,
            ecode: 403
        });
    }
}