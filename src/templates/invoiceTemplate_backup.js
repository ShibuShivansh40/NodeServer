module.exports = (data) => {
  // Map through the items to create the table rows dynamically [web:214]
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
        @page {
            size: 105mm 148mm;  /* Explicit A6 size [web:746] */
            margin: 6mm;        /* Standard margin for all pages */
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; }
        
        /* A6 Size: 105mm × 148mm */
        .pdf-container {
            width: 105mm; min-height: 148mm; padding: 0mm;
            display: block; font-size: 8.5pt; color: #333;
        }

        .header { text-align: center; border-bottom: 1.5px solid #333; margin-bottom: 3mm; padding-bottom: 1mm; }
        .header h1 { font-size: 13pt; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5mm; }
        .header h3 { font-size: 9pt; font-weight: 600; color: #444; }
        
        .meta { display: flex; justify-content: space-between; font-size: 7.5pt; color: #555; margin-top: 1.5mm; }

        .fields-grid { margin-bottom: 3mm; border-bottom: 0.5px solid #eee; padding-bottom: 2mm; }
        .field { display: flex; align-items: baseline; gap: 2mm; margin-bottom: 1mm; }
        .label { font-size: 7.5pt; font-weight: bold; color: #555; text-transform: uppercase; width: 30px; }

        table { width: 100%; border-collapse: collapse; font-size: 7.5pt; margin-bottom: auto; }
        th { background: #f0f0f0; text-align: left; padding: 1.2mm; border: 0.8px solid #333; text-transform: uppercase; font-size: 6.5pt; }
        td { border: 0.5px solid #ccc; padding: 1.2mm; vertical-align: middle; }
        td.num { text-align: right; }
        tr { page-break-inside: avoid; break-inside: avoid; }

        .total-row td { font-weight: bold; background: #fafafa; border-top: 1.5px solid #333; }

        .signatures { display: flex; justify-content: space-between; margin-top: 10mm; }
        .sig-block { text-align: center; width: 45%; }
        .sig-line { border-top: 0.8px solid #333; margin-bottom: 1mm; height: 5mm; }
        .sig-label { font-size: 6.5pt; font-weight: bold; text-transform: uppercase; }

        .footer { font-size: 6pt; text-align: center; color: #999; margin-top: 2mm; border-top: 0.5px solid #eee; padding-top: 1mm; }
    </style>
</head>
<body>
    <div class="pdf-container">
        <div class="header">
            <h1>Price Estimate</h1>
            <h3>Jai Industrial Corporation</h3>
            <div class="meta">
                <span><strong>Ref :</strong> ${data.refNo || '2025/HP/01'}</span>
                <span><strong>Date :</strong> ${data.date || new Date().toLocaleDateString('en-IN')}</span>
            </div>
        </div>

        <div class="fields-grid">
            <div class="field">
                <span class="label">M/s</span>
                <span style="border-bottom: 0.5px solid #ddd; flex: 1;">${data.clientName || 'N/A'}</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="8%">S.N</th>
                    <th width="35%">Item Name</th>
                    <th width="17%">Cat</th>
                    <th width="10%">Qty</th>
                    <th width="15%">Rate</th>
                    <th width="15%">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
                <tr class="total-row">
                    <td colspan="5" style="text-align: right; padding-right: 2mm;">GRAND TOTAL</td>
                    <td class="num">₹ ${data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
            </tbody>
        </table>

        <div class="signatures">
            <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-label">Authorized By</div>
            </div>
            <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-label">Receiver's Sign</div>
            </div>
        </div>

    </div>
</body>
</html>`;
};

