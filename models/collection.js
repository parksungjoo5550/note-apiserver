module.exports = (sequelize, DataTypes) => {
    const Collection = sequelize.define('collection', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        pdfURL: { type: DataTypes.STRING }, 
        timeLimit: { 
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isDone: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        type: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        createdAt: { type: DataTypes.STRING },
    }, { timestamps: false });
    
    Collection.WORKBOOK = 0;
    Collection.WORKPAPER = {
        exam: 1,
        homework: 2,
        practice: 3
    };
    
    Collection.findOneByUserid = function (userid) {
        return this.findOne({ where: { userid: userid } });
    }
    Collection.findOneByIndex = function (index) {
        return this.findOne({ where: { index: index } });
    }
    
    return Collection;
}