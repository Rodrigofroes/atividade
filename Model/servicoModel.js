import { DataTypes } from 'sequelize';
import Database from '../Database/database.js';

const sequelize = Database.getInstance().getConnection();

const Servico = sequelize.define('Servico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prazo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Prazo em minutos'
    }
}, {
    tableName: 'servicos',
    timestamps: false
});

export default Servico;