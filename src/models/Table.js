const { Model } = require('sequelize');

module.exports = (sequelize) => {
    class Table extends Model {}
    Table.getColum = async () => {
        const tableColumns = `SELECT COLUMN_NAME AS columnName
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'results';`;
        const data = await sequelize.query(tableColumns);
        console.log(data[0]);
    };
    // console.log(Table.getColum());

    Table.getResult = async () => {
        const tableColumns = `SELECT * FROM results;`;
        const data = await sequelize.query(tableColumns);
        const groupedData = data[0].reduce((acc, cur) => {
            if (!acc[cur.roll]) {
                acc[cur.roll] = [];
            }
            acc[cur.roll].push(cur);
            return acc;
        }, {});

        const result = Object.values(groupedData);
        console.log(data, 'data');
        console.log(result, 'result');
    };
    // console.log(Table.getResult());
    Table.init(
        {},
        {
            sequelize,
            modelName: 'table',
            underscored: false,
        },
    );

    Table.columns = async (tableName) => {
        const query = `SELECT column_name FROM information_schema.columns WHERE table_name='${tableName}'`;
        const result = await sequelize.query(query);
        return result[0];
    };

    Table.addColumn = async ({ tableName, columnName, afterColumn }) => {
        const query = afterColumn
            ? `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` VARCHAR(15) AFTER \`${afterColumn}\``
            : `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` VARCHAR(15)`;
        await sequelize.query(query);
    };

    Table.deleteColumn = async ({ tableName, columnName }) => {
        const query = `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`;
        await sequelize.query(query);
    };

    return Table;
};
