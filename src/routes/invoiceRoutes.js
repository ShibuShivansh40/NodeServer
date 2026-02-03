// const express = require('express');
// const router = express.Router();
// const {
//     Op
// } = require('sequelize');
// const invoiceController = require('../controllers/invoiceGenerator');
// const Invoice = require('../models/Invoice');
// const Client = require('../models/Client');
// const Product = require('../models/Product');

// // Log all incoming requests for debugging
// router.use((req, res, next) => {
//     console.log(`Route hit: ${req.method} ${req.path}`);
//     next();
// });

// // Standard Routes
// router.post('/generate-pdf', invoiceController.createAndSendPDF);
// router.post('/fetch-pdf', invoiceController.fetchExistingPDF);
// router.get('/records', invoiceController.getAllRecords);
// router.get('/count', invoiceController.getCount);

// // Summary Route
// router.post('/generate-summary', async (req, res) => {
//     try {
//         const {
//             ids
//         } = req.body;

//         const invoices = await Invoice.findAll({
//             where: {
//                 refNo: {
//                     [Op.in]: ids
//                 }
//             }
//         });

//         if (invoices.length === 0) return res.status(404).json({
//             error: "No records found"
//         });

//         const summaryData = invoices.reduce((acc, inv) => {
//             const client = inv.clientName;
//             if (!acc[client]) {
//                 acc[client] = {
//                     colored: {
//                         qty: 0,
//                         bags: 0
//                     },
//                     black: {
//                         qty: 0,
//                         bags: 0
//                     },
//                     tpe: {
//                         qty: 0,
//                         bags: 0
//                     }
//                 };
//             }

//             inv.items.forEach(item => {
//                 const cat = (item.category || '').toLowerCase();
//                 const qty = parseFloat(item.qty || 0);
//                 if (cat.includes('colored')) acc[client].colored.qty += qty;
//                 else if (cat.includes('black')) acc[client].black.qty += qty;
//                 else if (cat.includes('tpe')) acc[client].tpe.qty += qty;
//             });

//             // Calculate bags after summing
//             acc[client].colored.bags = Math.ceil(acc[client].colored.qty / 25);
//             acc[client].black.bags = Math.ceil(acc[client].black.qty / 50);
//             acc[client].tpe.bags = Math.ceil(acc[client].tpe.qty / 25);

//             return acc;
//         }, {});

//         const pdfBase64 = await invoiceController.generateSummaryPDF(summaryData);

//         res.json({
//             success: true,
//             pdf: pdfBase64
//         });
//     } catch (error) {
//         console.error("Summary Generation Error:", error);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Client Routes
// router.get('/clients', async (req, res) => {
//     try {
//         const clients = await Client.findAll({
//             order: [
//                 ['name', 'ASC']
//             ]
//         });
//         res.json(clients);
//     } catch (err) {
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// router.post('/clients', async (req, res) => {
//     try {
//         const newClient = await Client.create(req.body);
//         res.status(201).json(newClient);
//     } catch (err) {
//         res.status(400).json({
//             error: "Client already exists or invalid data"
//         });
//     }
// });

// // Product Routes – Ensure this is present to fix 404
// router.get('/products', async (req, res) => {
//     try {
//         const products = await Product.findAll({
//             order: [
//                 ['name', 'ASC']
//             ]
//         });
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// // router.post('/products', async (req, res) => {
// //   try {
// //     const newProduct = await Product.create(req.body);
// //     res.status(201).json(newProduct);
// //   } catch (err) {
// //     res.status(400).json({ error: "Product already exists or invalid data" });
// //   }
// // });

// router.post('/products', async (req, res) => {
//     try {
//         const {
//             name,
//             category,
//             code
//         } = req.body; // Require code
//         const newProduct = await Product.create({
//             name,
//             category,
//             code
//         });
//         res.status(201).json(newProduct);
//     } catch (err) {
//         res.status(400).json({
//             error: "Product already exists or invalid data"
//         });
//     }
// });

// router.get('/products', async (req, res) => {
//     try {
//         const products = await Product.findAll({
//             order: [
//                 ['name', 'ASC']
//             ]
//         });
//         res.json(products); // Includes code
//     } catch (err) {
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// // Updated invoiceRoutes.js snippet for /invoice route

// router.get('/invoice/:refNo', async (req, res) => {
//     console.log('Fetching invoice for refNo:', req.params.refNo);
//     try {
//         const invoice = await Invoice.findByPk(req.params.refNo);
//         if (!invoice) {
//             console.log('No invoice found for refNo:', req.params.refNo);
//             return res.status(404).json({
//                 error: 'Invoice not found'
//             });
//         }
//         console.log('Found invoice:', invoice.toJSON()); // Log full invoice
//         res.json(invoice.toJSON()); // Send as JSON
//     } catch (err) {
//         console.error('Fetch invoice error:', err);
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// // In invoiceRoutes.js - replace your PUT route with this
// router.put('/update-invoice/:refNo', async (req, res) => {
//     console.log('PUT /update-invoice hit - refNo:', req.params.refNo);
//     console.log('Request body received:', JSON.stringify(req.body, null, 2)); // Critical log

//     if (!req.body || Object.keys(req.body).length === 0) {
//         console.log('Empty body received!');
//         return res.status(400).json({
//             success: false,
//             error: 'No data sent in request body'
//         });
//     }

//     let browser;
//     try {
//         const invoice = await Invoice.findByPk(req.params.refNo);
//         if (!invoice) {
//             console.log('Invoice not found');
//             return res.status(404).json({
//                 success: false,
//                 error: 'Invoice not found'
//             });
//         }

//         console.log('Before update:', invoice.toJSON());

//         // Validate required fields
//         if (!req.body.clientName || !req.body.items || !Array.isArray(req.body.items)) {
//             console.log('Invalid data in body');
//             return res.status(400).json({
//                 success: false,
//                 error: 'Missing or invalid invoice data'
//             });
//         }

//         // Update
//         await invoice.update({
//             clientName: req.body.clientName,
//             date: req.body.date,
//             items: req.body.items,
//             total: req.body.total
//         });

//         console.log('After update:', (await invoice.reload()).toJSON());

//         // Regenerate PDF
//         browser = await puppeteer.launch({
//             headless: 'shell',
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });
//         const page = await browser.newPage();
//         const html = invoiceTemplate(req.body); // Use updated body
//         await page.setContent(html);
//         const pdfBuffer = await page.pdf({
//             format: 'A6',
//             printBackground: true
//         });
//         await browser.close();

//         const base64 = Buffer.from(pdfBuffer).toString('base64');
//         console.log('PDF generated successfully, length:', base64.length);

//         res.json({
//             success: true,
//             pdf: base64,
//             refNo: req.params.refNo
//         });
//     } catch (error) {
//         if (browser) await browser.close();
//         console.error('PUT ERROR DETAILS:', error.message);
//         console.error('Full stack:', error.stack);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
    Op
} = require('sequelize');
const puppeteer = require('puppeteer'); // Make sure this is imported here if not in controller
const invoiceTemplate = require('../templates/invoiceTemplate');
const invoiceController = require('../controllers/invoiceGenerator');
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Product = require('../models/Product');

// Log all incoming requests (good for debugging)
router.use((req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.path}`);
    next();
});

// Standard Routes (unchanged)
router.post('/generate-pdf', invoiceController.createAndSendPDF);
router.post('/fetch-pdf', invoiceController.fetchExistingPDF);
router.get('/records', invoiceController.getAllRecords);
router.get('/count', invoiceController.getCount);

// Summary Route (unchanged, looks fine)
router.post('/generate-summary', async (req, res) => {
    try {
        const {
            ids
        } = req.body;
        const invoices = await Invoice.findAll({
            where: {
                refNo: {
                    [Op.in]: ids
                }
            }
        });

        if (invoices.length === 0) return res.status(404).json({
            error: "No records found"
        });

        const summaryData = invoices.reduce((acc, inv) => {
            const client = inv.clientName;
            if (!acc[client]) {
                acc[client] = {
                    colored: {
                        qty: 0,
                        bags: 0
                    },
                    black: {
                        qty: 0,
                        bags: 0
                    },
                    tpe: {
                        qty: 0,
                        bags: 0
                    }
                };
            }

            inv.items.forEach(item => {
                const cat = (item.category || '').toLowerCase();
                const qty = parseFloat(item.qty || 0);
                if (cat.includes('colored')) acc[client].colored.qty += qty;
                else if (cat.includes('black')) acc[client].black.qty += qty;
                else if (cat.includes('tpe')) acc[client].tpe.qty += qty;
            });

            acc[client].colored.bags = Math.ceil(acc[client].colored.qty / 25);
            acc[client].black.bags = Math.ceil(acc[client].black.qty / 50);
            acc[client].tpe.bags = Math.ceil(acc[client].tpe.qty / 25);

            return acc;
        }, {});

        const pdfBase64 = await invoiceController.generateSummaryPDF(summaryData);
        res.json({
            success: true,
            pdf: pdfBase64
        });
    } catch (error) {
        console.error("Summary Generation Error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Client Routes (unchanged)
router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
        res.json(clients);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/clients', async (req, res) => {
    try {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({
            error: "Client already exists or invalid data"
        });
    }
});

// Product Routes (your version is good - keep it)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/products', async (req, res) => {
    try {
        const {
            name,
            category,
            code
        } = req.body;
        const newProduct = await Product.create({
            name,
            category,
            code
        });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({
            error: "Product already exists or invalid data"
        });
    }
});

// Fetch single invoice (your version is good - keep)
router.get('/invoice/:refNo', async (req, res) => {
    console.log('Fetching invoice for refNo:', req.params.refNo);
    try {
        const invoice = await Invoice.findByPk(req.params.refNo);
        if (!invoice) {
            console.log('No invoice found for refNo:', req.params.refNo);
            return res.status(404).json({
                error: 'Invoice not found'
            });
        }
        console.log('Found invoice:', invoice.toJSON());
        res.json(invoice.toJSON());
    } catch (err) {
        console.error('Fetch invoice error:', err);
        res.status(500).json({
            error: err.message
        });
    }
});


router.put('/update-invoice/:refNo', async (req, res) => {
    const refNo = req.params.refNo;
    console.log(`[PUT] Started for refNo: ${refNo}`);
    console.log(`[PUT] Incoming body:`, JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.clientName || !req.body.items || !Array.isArray(req.body.items)) {
        console.log('[PUT] Invalid body');
        return res.status(400).json({
            success: false,
            error: 'Invalid request body'
        });
    }

    let browser = null;
    try {
        const invoice = await Invoice.findByPk(refNo);
        if (!invoice) {
            console.log('[PUT] Invoice not found');
            return res.status(404).json({
                success: false,
                error: 'Invoice not found'
            });
        }

        console.log('[PUT] Before update:', invoice.toJSON());

        // Update DB
        await invoice.update({
            clientName: req.body.clientName,
            date: req.body.date,
            items: req.body.items,
            total: req.body.total || 0
        });
        await invoice.reload();
        console.log('[PUT] After update:', invoice.toJSON());

        // Generate PDF using updated data
        console.log('[PUT] Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: 'shell',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        console.log('[PUT] Generating HTML...');
        const html = invoiceTemplate(invoice.toJSON()); // Use fresh DB data
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });
        console.log('[PUT] Creating PDF buffer...');
        const pdfBuffer = await page.pdf({
            format: 'A6',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });
        await browser.close();
        browser = null;

        const base64 = Buffer.from(pdfBuffer).toString('base64');
        console.log(`[PUT] PDF ready - length: ${base64.length}`);

        res.json({
            success: true,
            pdf: base64,
            refNo
        });
    } catch (err) {
        if (browser) await browser.close().catch(e => console.error('Browser close fail:', e));
        console.error('[PUT] ERROR:', err.message);
        console.error('[PUT] Stack:', err.stack);
        res.status(500).json({
            success: false,
            error: err.message || 'Server error'
        });
    }
});


module.exports = router;