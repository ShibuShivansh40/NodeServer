module.exports = (summaryData) => {
  // Generate rows for each client [web:868]
  const rows_1 = Object.entries(summaryData).map(([client, totals]) => `
    <tr>
      <td style="text-align: left; padding-left: 5mm;">${client}</td>
      <td class="num">${totals.colored}</td>
      <td class="num">${totals.black}</td>
      <td class="num">${totals.tpe}</td>
      <td class="num" style="font-weight: bold;">${totals.colored + totals.black + totals.tpe}</td>
    </tr>
  `).join('');

    const rows = Object.entries(summaryData).map(([client, totals]) => `
      <tr>
        <td style="text-align: left; padding-left: 5mm;">${client}</td>
        <td class="num">${totals.colored.qty} pcs <br><small>(${totals.colored.bags} Bags)</small></td>
        <td class="num">${totals.black.qty} pcs <br><small>(${totals.black.bags} Bags)</small></td>
        <td class="num">${totals.tpe.qty} pcs <br><small>(${totals.tpe.bags} Bags)</small></td>
        <td class="num" style="font-weight: medium;"> ${totals.colored.bags + totals.black.bags + totals.tpe.bags} Bags</td>
      </tr>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        @page { size: A5; margin: 10mm; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; }
        .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 10mm; padding-bottom: 5mm; }
        table { width: 100%; border-collapse: collapse; margin-top: 5mm; }
        th { background: #f4f4f4; border: 1px solid #333; padding: 3mm; font-size: 10pt; text-transform: uppercase; }
        td { border: 0.5px solid #ccc; padding: 3mm; text-align: center; font-size: 10pt; }
        .num { text-align: left; padding-right: 3mm; }
        .footer { margin-top: 20mm; font-size: 8pt; text-align: center; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Vehicle Dispatch Summary</h1>
        <h3>Jai Industrial Corporation</h3>
    </div>
    <span><strong>Date : </strong>${new Date().toLocaleDateString('en-IN')}</span>
    <table>
        <thead>
            <tr>
                <th style="text-align: left; padding-left: 5mm;">Client Name</th>
                <th>Colored</th>
                <th>Black</th>
                <th>TPE</th>
                <th>Total Bags</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
</body>
</html>`;
};

