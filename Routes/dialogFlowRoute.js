import express from 'express';
import DialogFlowControl from '../Control/dialogFlowControl.js';
const router = express.Router();

const dialogFlowControl = new DialogFlowControl();

router.post('/', (req, res) => dialogFlowControl.DialogFlow(req, res));

export default router;