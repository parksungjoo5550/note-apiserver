module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category: { type: DataTypes.STRING.BINARY },
        type: { type: DataTypes.INTEGER }
    }, { timestamps: false });
    
    Category.findOneById = function (id) {
        return this.findOne({ where: { id: id } });
    }
    
    Category.COURSE = 1;
    Category.BIG_CHAPTER = 2;
    Category.MIDDLE_CHAPTER = 3;
    Category.SMALL_CHAPTER = 4;
    
    return Category;
}