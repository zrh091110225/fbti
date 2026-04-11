import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { appendJsonLine, countJsonLines } from './storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  const [events, results] = await Promise.all([
    countJsonLines('events.jsonl'),
    countJsonLines('results.jsonl')
  ]);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    counts: { events, results }
  });
});

app.post('/api/events', async (req, res) => {
  const { event, properties, timestamp } = req.body ?? {};

  if (typeof event !== 'string' || !event.trim()) {
    res.status(400).json({ error: 'event is required' });
    return;
  }

  await appendJsonLine('events.jsonl', {
    event,
    properties: typeof properties === 'object' && properties !== null ? properties : {},
    timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
    receivedAt: new Date().toISOString()
  });

  res.status(201).json({ ok: true });
});

app.post('/api/results', async (req, res) => {
  const { personalityId, answers, completedAt } = req.body ?? {};

  if (typeof personalityId !== 'string' || !Array.isArray(answers)) {
    res.status(400).json({ error: 'personalityId and answers are required' });
    return;
  }

  await appendJsonLine('results.jsonl', {
    personalityId,
    answers,
    completedAt: typeof completedAt === 'string' ? completedAt : new Date().toISOString(),
    receivedAt: new Date().toISOString()
  });

  res.status(201).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`FBTI Backend running on http://localhost:${PORT}`);
});
