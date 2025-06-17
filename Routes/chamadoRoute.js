import express from 'express';
import ChamadoControl from '../Control/chamadoControl.js';

const router = express.Router();
const chamadoControl = new ChamadoControl();

router.post('/', chamadoControl.salvar);
router.get('/', chamadoControl.listar);
router.put('/id/:id', chamadoControl.atualizar);
router.delete('/id/:id', chamadoControl.deletar);

export default router;