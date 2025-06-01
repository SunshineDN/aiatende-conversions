import express from 'express';
import TrackingDataController from '../controllers/TrackingDataController.js';

const router = express.Router();
const tracking_data = new TrackingDataController();

router.get('/wbhk', tracking_data.handleWebhookReceived(req, res));

router.post('/wbhk/message-upsert', tracking_data.handleMessageUpsert(req, res));

export default router;