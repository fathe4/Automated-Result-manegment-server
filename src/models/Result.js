const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Result extends Model {}

    Result.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roll: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            group: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            bangla_1st_CQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bangla_1st_MCQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bangla_2nd_CQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bangla_2nd_MCQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            english_1st_CQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            english_2nd_CQ: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ICT: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'result',
            underscored: true,
        },
    );
    return Result;
};
// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//     class Result extends Model {}

//     Result.init(
//         {
//             roll: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//             },
//             subjectName: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             score: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//         },
//         {
//             sequelize,
//             modelName: 'result',
//             underscored: false,
//         },
//     );
//     return Result;
// };
