const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Table extends Model {}

    Table.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // Add any existing fields here
            existingField: {
                type: DataTypes.STRING(15),
            },
        },
        {
            sequelize,
            modelName: 'table',
            underscored: false,
        },
    );
    Table.addColumn = async ({ tableName, columnHeading, afterColumn }) => {
        const query = afterColumn
            ? `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnHeading}\` VARCHAR(15) AFTER \`${afterColumn}\``
            : `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnHeading}\` VARCHAR(15)`;
        await sequelize.query(query);
    };

    return Table;
};
