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
const { Op } = require('sequelize'); // REQUIRED FOR SUMMARY QUERY [file:884]
const invoiceController = require('../controllers/invoiceGenerator');
//const { Invoice } = require('../models/Invoice'); // Import model directly [file:885]
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Product = require('../models/Product');

// Standard Routes [file:884]
router.post('/generate-pdf', invoiceController.createAndSendPDF);
router.post('/fetch-pdf', invoiceController.fetchExistingPDF);
router.get('/records', invoiceController.getAllRecords);
router.get('/count', invoiceController.getCount);

// Summary Route [file:884]
router.post('/generate-summary', async (req, res) => {
  try {
    const { ids } = req.body;
    
    // 1. Fetch only selected invoices [file:884]
    const invoices = await Invoice.findAll({
      where: { refNo: { [Op.in]: ids } }
    });

    if (invoices.length === 0) return res.status(404).json({ error: "No records found" });

    // 2. Aggregate Data [file:884]
    
    const summaryData = invoices.reduce((acc, inv) => {
    const client = inv.clientName;
    if (!acc[client]) {
      acc[client] = { 
        colored: { qty: 0, bags: 0 }, 
        black: { qty: 0, bags: 0 }, 
        tpe: { qty: 0, bags: 0 } 
      };
    } 
  
    inv.items.forEach(item => {
      const cat = (item.category || '').toLowerCase();
      const qty = parseFloat(item.qty || 0);
    
      if (cat.includes('colored')) {
        acc[client].colored.qty += qty;
      } else if (cat.includes('black')) {
        acc[client].black.qty += qty;
      } else if (cat.includes('tpe')) {
        acc[client].tpe.qty += qty;
      }
    });

    // After summing all items for this client, calculate bags [web:898]
    // Color/TPE: 25kg per bag | Black: 50kg per bag
    acc[client].colored.bags = Math.ceil(acc[client].colored.qty / 25);
    acc[client].black.bags = Math.ceil(acc[client].black.qty / 50);
    acc[client].tpe.bags = Math.ceil(acc[client].tpe.qty / 25);

    return acc;
  }, {});

    
//    const summaryData = invoices.reduce((acc, inv) => {
//      const client = inv.clientName;
 //     if (!acc[client]) acc[client] = { colored: 0, black: 0, tpe: 0 };
      
//      inv.items.forEach(item => {
//        const cat = (item.category || '').toLowerCase();
//        const qty = parseFloat(item.qty || 0);
//        if (cat.includes('colored')) acc[client].colored += qty;
 //       else if (cat.includes('black')) acc[client].black += qty;
//        else if (cat.includes('tpe')) acc[client].tpe += qty;
//      });

//      return acc;
//    }, {});

    // 3. Generate PDF using the function exported from invoiceGenerator.js [file:886]
    const pdfBase64 = await invoiceController.generateSummaryPDF(summaryData);

    res.json({ success: true, pdf: pdfBase64 });
  } catch (error) {
    console.error("Summary Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//const Client = require('../models/Client');
//const Product = require('../models/Product');

// Client Routes
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: "Client already exists or invalid data" });
  }
});

// Add this after router.get('/products', ...)
router.post('/products', async (req, res) => {
  try {
    // Expect req.body like { name: 'New Product', category: 'Black' } – category must match enum ('Black', 'Colored', 'TPE')
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Product already exists or invalid data" });
  }
});

module.exports = router;
    
