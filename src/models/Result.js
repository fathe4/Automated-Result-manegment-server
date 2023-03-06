const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Result extends Model {}
    const getColumn = async () => {
        const tableColumns = `SELECT COLUMN_NAME AS columnName
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'results';`;
        const data = await sequelize.query(tableColumns);
        return data[0].reduce(
            (acc, cur) => {
                if (cur.columnName !== 'id') {
                    acc[cur.columnName] = {
                        type: DataTypes.STRING,
                        allowNull: true,
                    };
                    return acc;
                }
                return acc;
            },
            {
                roll: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
        );
    };
    getColumn().then((column) => {
        return console.log(column);
    });
    Result.init(
        getColumn().then((column) => {
            return column;
        }),
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
//             name: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             roll: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 primaryKey: true,
//             },
//             year: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 primaryKey: true,
//             },
//             group: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 primaryKey: true,
//             },
//             bangla_1st_CQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             bangla_1st_MCQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             bangla_2nd_CQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             bangla_2nd_MCQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             english_1st_CQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             english_2nd_CQ: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             ICT: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//         },
//         {
//             sequelize,
//             modelName: 'result',
//             underscored: true,
//         },
//     );
//     return Result;
// };
