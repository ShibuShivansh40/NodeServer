module.exports = (data) => {
  // 1. Calculate Quantity Totals by Category [web:814][web:820]
  const totalsByCategory = data.items.reduce((acc, item) => {
    const cat = (item.category || 'Other').toLowerCase();
    const qty = parseFloat(item.qty || 0);
    
    if (cat.includes('colored')) acc.colored += qty;
    else if (cat.includes('black')) acc.black += qty;
    else if (cat.includes('tpe')) acc.tpe += qty;
    
    return acc;
  }, { colored: 0, black: 0, tpe: 0 });

  // 2. Generate Table Rows [web:214]
  const itemRows = data.items.map((item, index) => `
    <tr>
      <td class="num">${index + 1}</td>
      <td>${item.name || ''}</td>
      <td>${item.category || ''}</td>
      <td class="num">${item.qty || 0}</td>
      <td class="num">${item.rate || 0}</td>
      <td class="num">₹ ${(item.qty * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        /* A5 Setup: 148mm × 210mm [web:808] */
        @page {
            size: 148mm 210mm;
            margin: 5mm; 
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: white; }
        
        .pdf-container {
            width: 100%; min-height: 100%; 
            display: block; font-size: 9.5pt; color: #333;
        }

        .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 5mm; padding-bottom: 2mm; }
        .header h1 { font-size: 16pt; text-transform: uppercase; margin-bottom: 1mm; }
        
        .meta { display: flex; justify-content: space-between; font-size: 9pt; margin-top: 2mm; }

        .fields-grid { margin-bottom: 5mm; border-bottom: 0.5px solid #eee; padding-bottom: 3mm; }
        .label { font-size: 9pt; font-weight: bold; width: 40px; }

        table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 5mm; }
        th { background: #f0f0f0; padding: 2mm; border: 1px solid #333; text-transform: uppercase; }
        td { border: 0.5px solid #ccc; padding: 2mm; vertical-align: middle; }
        td.num { text-align: right; }
        tr { page-break-inside: avoid; break-inside: avoid; }

        .total-row td { font-weight: bold; background: #fafafa; border-top: 2px solid #333; }

        /* Summary Section */
        .category-summary { 
            margin-top: 5mm; padding: 3mm; border: 1px dashed #ccc; 
            border-radius: 5px; background: #fdfdfd; 
        }
        .summary-title { font-weight: bold; font-size: 8.5pt; margin-bottom: 2mm; text-decoration: underline; }
        .summary-grid { display: flex; gap: 10mm; font-size: 8.5pt; color: #555; }

        .signatures { display: flex; justify-content: space-between; margin-top: 15mm; }
        .sig-block { text-align: center; width: 40%; }
        .sig-line { border-top: 1px solid #333; height: 10mm; }
    </style>
</head>
<body>
    <div class="pdf-container">
        <div class="header">
            <h1>Price Estimate</h1>
            <h3>Jai Industrial Corporation</h3>
            <div class="meta">
                <span><strong>Ref :</strong> ${data.refNo}</span>
                <span><strong>Date :</strong> ${data.date}</span>   
            </div>
        </div>

        <div class="fields-grid">
            <div class="field">
                <span class="label">M/s</span>
                <span style="border-bottom: 0.5px solid #ddd;">${data.clientName}</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="8%">S.No</th>
                    <th width="35%">Item Name</th>
                    <th width="15%">Category</th>
                    <th width="10%">Qty</th>
                    <th width="13%">Rate</th>
                    <th width="20%">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
                <tr class="total-row">
                    <td colspan="5" style="text-align: right; padding-right: 2mm;">GRAND TOTAL</td>
                    <td class="num">₹ ${data.total.toLocaleString('en-IN')}</td>
                </tr>
            </tbody>
        </table>

        <!-- Category Summary Section [web:814] -->
        <div class="category-summary">
            
            <div class="summary-grid">
            <p class="summary-title">Quantity Summary (By Category):</p>
                <span><strong>Colored:</strong> ${totalsByCategory.colored}</span>
                <span><strong>Black:</strong> ${totalsByCategory.black}</span>
                <span><strong>7D:</strong> ${totalsByCategory.tpe}</span>
            </div>
        </div>

        <div class="signatures">
            <div class="sig-block"><div class="sig-line"></div><p>Authorized Signatory</p></div>
            <div class="sig-block"><div class="sig-line"></div><p>Receiver's Signature</p></div>
        </div>
    </div>
</body>
</html>`;
};

