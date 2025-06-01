import express from 'express';
import cors from 'cors';
import apiDocs from './src/routes/api-docs.js';
import detectContent from './src/routes/detect-content.js';
import webhook from './src/routes/webhook.js';
import tracking_data from './src/routes/tracking-data.js';
import ga4_conversions from './src/routes/ga4-conversions.js';
import prisma from './src/prisma-client.js';

const app = express();

app.use(cors());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', database: 'OK' });
  } catch (error) {
    return res.status(503).json({
      status: 'DOWN',
      database: 'ERROR',
      message: error.message
    });
  }
});

app.use('/api-docs', apiDocs);
app.use('/content', detectContent);
app.use('/webhook', webhook);
app.use('/whatsapp', tracking_data);
app.use('/conversions/ga4', ga4_conversions);

app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado!' });
});

export default app;
