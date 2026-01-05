const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceGenerator');

router.post('/generate-pdf', invoiceController.createAndSendPDF);
router.post('/fetch-pdf', invoiceController.fetchExistingPDF);
router.get('/records', invoiceController.getAllRecords);

module.exports = router;


const { generateSummaryPDF } = require('../controllers/invoiceGenerator');

router.post('/generate-summary', async (req, res) => {
  try {
    const { ids } = req.body;
    const { Invoice } = require('../models/Invoice');

    const invoices = await Invoice.findAll({ where: { refNo: { [Op.in]: ids } } });
    
    // Aggregation Logic (as discussed before) [web:868]
    const summaryData = invoices.reduce((acc, inv) => {
      const client = inv.clientName;
      if (!acc[client]) acc[client] = { colored: 0, black: 0, tpe: 0 };
      inv.items.forEach(it => {
        const cat = (it.category || '').toLowerCase();
        const qty = parseFloat(it.qty || 0);
        if (cat.includes('colored')) acc[client].colored += qty;
        else if (cat.includes('black')) acc[client].black += qty;
        else if (cat.includes('tpe')) acc[client].tpe += qty;
      });
      return acc;
    }, {});

    const pdf = await generateSummaryPDF(summaryData); // Call the new generator
    res.json({ success: true, pdf });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
