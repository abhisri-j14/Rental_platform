const express = require('express');
const router = express.Router();
const { B2BLead } = require('../models');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUBMIT B2B LEAD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/request', async (req, res) => {
  try {
    const { name, company, phone, email, packageType, teamSize, notes } = req.body;

    if (!name || !company || !phone || !email || !packageType) {
      return res.status(400).json({ error: 'Name, company, phone, email, and package type are required' });
    }

    const lead = await B2BLead.create({
      name,
      company,
      phone,
      email,
      packageType,
      teamSize: Number(teamSize) || 1,
      notes: notes || '',
    });

    console.log(`💼 New B2B Lead: ${name} from ${company} (Package: ${packageType})`);

    res.status(201).json({
      message: 'Callback request received! A Gizzmo representative will call you within 2 hours.',
      lead,
    });
  } catch (err) {
    console.error('❌ B2B Lead submission error:', err.message);
    res.status(500).json({ error: 'Failed to submit callback request' });
  }
});

module.exports = router;
