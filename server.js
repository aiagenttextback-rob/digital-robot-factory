require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', engine: 'Digital Robot Factory v1.0' });
});

app.post('/api/leads/ingest', async (req, res) => {
  const { name, phone, zipcode, serviceRequested } = req.body;

  try {
    const leadResult = await db.query(
      `INSERT INTO leads (customer_name, customer_phone, zipcode, service_requested)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, phone, zipcode, serviceRequested]
    );
    const lead = leadResult.rows[0];

    const contractorResult = await db.query(
      `SELECT * FROM contractors 
       WHERE $1 = ANY(target_zipcodes) AND active = true 
       LIMIT 1`,
      [zipcode]
    );

    if (contractorResult.rows.length === 0) {
      await db.query(`UPDATE leads SET status = 'UNMATCHED' WHERE id = $1`, [lead.id]);
      return res.status(200).json({ success: true, status: 'UNMATCHED', message: 'Lead recorded without contractor match' });
    }

    const contractor = contractorResult.rows[0];

    const dispatchResult = await db.query(
      `INSERT INTO dispatches (lead_id, contractor_id, lead_price_cents, billing_status)
       VALUES ($1, $2, 5000, 'PENDING') RETURNING *`,
      [lead.id, contractor.id]
    );

    await db.query(`UPDATE leads SET status = 'DISPATCHED' WHERE id = $1`, [lead.id]);

    return res.status(200).json({
      success: true,
      status: 'DISPATCHED',
      dispatchId: dispatchResult.rows[0].id,
      assignedContractor: contractor.business_name
    });

  } catch (err) {
    console.error('[DISPATCH ERROR]', err);
    return res.status(500).json({ success: false, error: 'Database execution failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Engine online on port ${PORT}`);
});
