require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', engine: 'Digital Robot Factory v1.0' });
});

app.post('/api/leads/ingest', async (req, res) => {
  const { name, phone, zipcode, serviceRequested } = req.body;
  console.log(`[LEAD INGESTED] ${serviceRequested} in ${zipcode} from ${name} (${phone})`);
  res.status(200).json({ success: true, message: 'Lead routed to dispatch queue' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Engine online on port ${PORT}`);
});
