import Database from './database.js';
import Servico from '../Model/servicoModel.js';
import Tecnico from '../Model/tecnicoModel.js';

async function inicializarDados() {
    try {
        const db = Database.getInstance();
        await db.connection.sync({ force: false });
        
        const servicosCount = await Servico.count();
        if (servicosCount === 0) {
            await Servico.bulkCreate([
                { nome: 'impressora', prazo: 360 }, 
                { nome: 'email', prazo: 120 },
                { nome: 'ero', prazo: 60 },
                { nome: 'acesso à internet', prazo: 30 }
            ]);
            console.log('✅ Serviços inicializados com sucesso!');
        }

        const tecnicosCount = await Tecnico.count();
        if (tecnicosCount === 0) {
            await Tecnico.bulkCreate([
                { nome: 'João Silva' },
                { nome: 'Maria Oliveira' },
                { nome: 'Carlos Santos' },
                { nome: 'Ana Pereira' },
                { nome: 'Pedro Almeida' }
            ]);
            console.log('✅ Técnicos inicializados com sucesso!');
        }

        console.log('✅ Dados iniciais verificados e carregados se necessário!');
    } catch (error) {
        console.error('❌ Erro ao inicializar dados:', error);
    }
}

export default inicializarDados;