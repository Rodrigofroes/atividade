import { DataTypes } from 'sequelize';
import Database from '../Database/database.js';

const sequelize = Database.getInstance().getConnection();

const Tecnico = sequelize.define('Tecnico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tecnicos',
    timestamps: false
});

export default Tecnico;