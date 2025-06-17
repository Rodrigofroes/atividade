import { DataTypes } from 'sequelize';
import Database from '../Database/database.js';
import Tecnico from './tecnicoModel.js';

const sequelize = Database.getInstance().getConnection();

const Chamado = sequelize.define('Chamado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario_matricula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario_endereco: {
        type: DataTypes.STRING,
        allowNull: true
    },
    usuario_telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    servicos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tecnico_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Tecnico,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Aberto'
    }
}, {
    tableName: 'chamados',
    timestamps: true
});

Chamado.belongsTo(Tecnico, { foreignKey: 'tecnico_id' });
Tecnico.hasMany(Chamado, { foreignKey: 'tecnico_id' });

export default Chamado;