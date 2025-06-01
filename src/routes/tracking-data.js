import express from 'express';
import TrackingDataController from '../controllers/TrackingDataController.js';

const router = express.Router();
const tracking_data = new TrackingDataController();

router.get('/wbhk', (req, res) => tracking_data.handleWebhookReceived(req, res));

router.post('/wbhk/message-upsert', (req, res) => tracking_data.handleMessageUpsert(req, res));

export default router;