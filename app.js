import express from 'express';
import cors from 'cors';
import apiDocs from './src/routes/api-docs.js';
import detectContent from './src/routes/detect-content.js';
import webhook from './src/routes/webhook.js';

const app = express();

app.use(cors());
app.use('/api-docs', apiDocs);
app.use('/content', detectContent);
app.use('/webhook', webhook);

app.use((_, res) => {
  res.status(404).json({error: 'Endpoint não encontrado!'});
});

export default app;
