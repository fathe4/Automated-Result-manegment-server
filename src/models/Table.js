const { Model } = require('sequelize');

module.exports = (sequelize) => {
    class Table extends Model {}

    Table.init(
        {},
        {
            sequelize,
            modelName: 'table',
            underscored: false,
        },
    );
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
