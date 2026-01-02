const puppeteer = require('puppeteer');

// Reusable function that takes record data and returns Base64 PDF
exports.generatePDFBuffer = async (record) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Your HTML template using the record's data
  const htmlContent = `<h1>Invoice ${record.refNo}</h1><p>Client: ${record.clientName}</p>`; 
  
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  
  return pdfBuffer.toString('base64');
};
