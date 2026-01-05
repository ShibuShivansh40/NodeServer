const puppeteer = require('puppeteer');
const { Invoice } = require('../models/Invoice');
const invoiceTemplate = require('../templates/invoiceTemplate');
const { Op } = require('sequelize');
const summaryTemplate = require('../templates/summaryTemplate');




// Helper to get initials
const getInitials = (name) => {
  const names = name.trim().split(' ');
  const initials = names.map(n => n.charAt(0).toUpperCase());
  return initials.length > 1 
    ? `${initials[0]}${initials[initials.length - 1]}` 
    : initials[0].substring(0, 2);
};

// --- REUSABLE PDF LOGIC ---
const generatePDF = async (data) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'shell', 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    const htmlContent = invoiceTemplate(data); 
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A6', printBackground: true });
    await browser.close();
    return Buffer.from(pdfBuffer).toString('base64');
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
};

// --- ROUTE 1: CREATE NEW ---
exports.createAndSendPDF = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const initials = getInitials(req.body.clientName);
    
    const count = await Invoice.count({
      where: { refNo: { [Op.like]: `${currentYear}/${initials}/%` } }
    });
    
    const sequence = (count + 1).toString().padStart(3, '0');
    const generatedRefNo = `${currentYear}/${initials}/${sequence}`;
  
    // Save to DB using the generated primary key [web:386]
    const invoice = await Invoice.create({ ...req.body, refNo: generatedRefNo });

    // Generate PDF using helper
    const base64String = await generatePDF(invoice);

    res.json({ success: true, pdf: base64String, refNo: generatedRefNo });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- ROUTE 2: FETCH EXISTING ---
exports.fetchExistingPDF = async (req, res) => {
  try {
    const { refNo } = req.body;
    // Find specific record by primary key [web:413]
    const record = await Invoice.findByPk(refNo);

    if (!record) {
      return res.status(404).json({ success: false, error: "Invoice not found" });
    }

    // Reuse the same PDF generation logic [web:492]
    const base64String = await generatePDF(record);

    res.json({ success: true, pdf: base64String, refNo: record.refNo });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- ROUTE 3: LIST ALL ---
exports.getAllRecords = async (req, res) => {
  try {
    const records = await Invoice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateSummaryPDF = async (summaryData) => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        headless: 'shell', 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    const html = summaryTemplate(summaryData); // Use the new template
    await page.setContent(html);

    const pdfBuffer = await page.pdf({ 
        format: 'A5', 
        printBackground: true,
        preferCSSPageSize: true 
    });

    await browser.close();
    return Buffer.from(pdfBuffer).toString('base64');
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
};

exports.getCount = async (req, res) => {
  try {
    const count = await Invoice.count(); // Sequelize method to get total [file:891]
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
