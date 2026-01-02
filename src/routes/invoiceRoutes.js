//const express = require('express');
//const router = express.Router();
//const invoiceController = require('../controllers/invoiceController');

//router.post('/generate-pdf', invoiceController.createAndSendPDF);
//router.get('/records', async (req, res) => {
//  try {
//    const { Invoice } = require('../models/Invoice');
//    const records = await Invoice.findAll({
//      order: [['createdAt', 'DESC']] // Show latest first [web:391]
//    });
//    res.json(records);
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
//});
//router.post('/fetch-pdf', async (req, res) => {
//  try {
//    const { refNo } = req.body;
//    const { Invoice } = require('../models/Invoice');
//    const record = await Invoice.findByPk(refNo);
    
//    if (!record) return res.status(404).json({ error: "Record not found" });

    // 2. Pass record data to your existing PDF generator function
//    const pdfBase64 = await generatePDFLogic(record); 

//    res.json({ success: true, pdf: pdfBase64 });
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
//});
//module.exports = router;

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceGenerator');

router.post('/generate-pdf', invoiceController.createAndSendPDF);
router.post('/fetch-pdf', invoiceController.fetchExistingPDF);
router.get('/records', invoiceController.getAllRecords);

module.exports = router;

