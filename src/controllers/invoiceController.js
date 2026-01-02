const puppeteer = require('puppeteer');
const { Invoice } = require('../models/Invoice');
const invoiceTemplate = require('../templates/invoiceTemplate');
const { Op } = require('sequelize');

const getInitials = (name) => {
  const names = name.trim().split(' ');
  const initials = names.map(n => n.charAt(0).toUpperCase());
  return initials.length > 1 
    ? `${initials[0]}${initials[initials.length - 1]}` 
    : initials[0].substring(0, 2); // Handle single name [web:420]
};

exports.createAndSendPDF = async (req, res) => {
  let browser;
  try {
    const currentYear = new Date().getFullYear();
    const initials = getInitials(req.body.clientName);
    const count = await Invoice.count({
      where: {
        refNo: {
          [Op.like]: `${currentYear}/${initials}/%` // e.g., 2026/JD/% [web:425]
        }
      }
    });
    
    const sequence = (count + 1).toString().padStart(3, '0');
    const generatedRefNo = `${currentYear}/${initials}/${sequence}`;
  
    // 1. Save record to Database
    const invoiceData = { ...req.body, refNo: generatedRefNo };
    const invoice = await Invoice.create(req.body);

    // 2. Launch Puppeteer with corrected syntax [web:285]
    browser = await puppeteer.launch({
      headless: 'shell', 
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage', 
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // 3. Generate HTML using your template
    const htmlContent = invoiceTemplate(req.body); 
    await page.setContent(htmlContent);
    
    // 4. Create PDF Buffer [web:214]
    const pdfBuffer = await page.pdf({format: 'A6', printBackground: true });
    await browser.close();

//    console.log("PDF Generate : ${pdfBuffer.length} bytes")
    // 5. Send Base64 response [web:215]
//    res.json({ success: true, pdf: pdfBuffer.toString('base64'), recordId: invoice.id });

    const base64String = Buffer.from(pdfBuffer).toString('base64');

    // DEBUG: This MUST start with "JVBER" (which is base64 for %PDF)
    console.log("Base64 Start:", base64String.substring(0, 10));

    //res.json({ success: true, pdf: base64String, recordId: invoice.id });
    res.json({ success: true, pdf: base64String, refNo: generatedRefNo });

  } catch (error) {
    if (browser) await browser.close();
    console.error("Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
