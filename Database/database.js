import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Database {
    static instance;

    constructor() {
        this.connection = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '../database.sqlite'),
            logging: false
        });

        this.testConnection();
    }

    async testConnection() {
        try {
            await this.connection.authenticate();
            console.log('✅ SQLite conectado com sucesso!');
            
            await this.connection.sync();
            console.log('✅ Modelos sincronizados com o banco de dados!');
        } catch (error) {
            console.error('❌ Erro na conexão com o SQLite:', error);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    getConnection() {
        return this.connection;
    }
}