module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category: { type: DataTypes.STRING.BINARY },
        type: { type: DataTypes.INTEGER }
    }, { timestamps: false });
    
    Category.findOneByindex = function (idx) {
        return this.findOne({ where: { index: idx } });
    }
    
    Category.BIG_CHAPTER = 1;
    Category.MIDDLE_CHAPTER = 2;
    Category.SMALL_CHAPTER = 3;
    
    return Category;
}