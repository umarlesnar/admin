export const generatePDFInvoice = (invoiceData: any) => {
  const {
    invoice_number,
    invoice_date,
    plan,
    type,
    subscription_type,
    payment_method,
    currency,
    discount,
    total_tax,
    total_price,
    status,
    period_start,
    period_end,
  } = invoiceData;

  const base_price_calculated = total_price - total_tax;

  const formatCurrency = (amount: number, cur: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
    }).format(amount);
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 20px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
        .invoice-number {
          font-size: 14px;
          color: #666;
          text-align: right;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 12px;
          font-weight: bold;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .details-table th {
          background-color: #f9f9f9;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: bold;
          color: #666;
          border-bottom: 1px solid #e0e0e0;
        }
        .details-table td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 13px;
          color: #333;
        }
        .summary {
          margin-top: 30px;
          border-top: 2px solid #f0f0f0;
          padding-top: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 13px;
        }
        .summary-row.total {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-paid {
          background-color: #def6e8;
          color: #28C76F;
        }
        .status-unpaid {
          background-color: #eaebed;
          color: #898a93;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">INVOICE</div>
          <div class="invoice-number">
            <strong>Invoice No: ${invoice_number}</strong><br>
            Date: ${invoice_date}
          </div>
        </div>

        <!-- The "Workspace Details" section has been removed as requested. -->

        <table class="details-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Plan</td>
              <td>${plan}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>${type}</td>
            </tr>
            <tr>
              <td>Subscription Type</td>
              <td>${subscription_type}</td>
            </tr>
            <tr>
              <td>Payment Method</td>
              <td>${payment_method}</td>
            </tr>
            <!-- Added Currency Details as requested -->
            <tr>
              <td>Currency</td>
              <td><strong>${currency}</strong></td>
            </tr>
            <tr>
              <td>Billing Period</td>
              <td>${period_start} to ${period_end}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Base Price (Total excluding Tax):</span>
            <span>${formatCurrency(base_price_calculated, currency)}</span>
          </div>
          ${discount > 0
      ? `<div class="summary-row">
            <span>Discount:</span>
            <span>-${formatCurrency(discount, currency)}</span>
          </div>`
      : ""
    }
          <div class="summary-row">
            <span>Tax:</span>
            <span>${formatCurrency(total_tax, currency)}</span>
          </div>
          <div class="summary-row total">
            <span>Total Amount Due:</span>
            <span>${formatCurrency(total_price, currency)}</span>
          </div>
          <div class="summary-row" style="margin-top: 15px;">
            <span>Status:</span>
            <span class="status-badge ${status === "paid" ? "status-paid" : "status-unpaid"
    }">
              ${status.toUpperCase()}
            </span>
          </div>
        </div>

        <div class="footer">
          <p>This is an automatically generated invoice. Please retain for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const downloadInvoicePDF = (invoiceData: any) => {
  const html = generatePDFInvoice(invoiceData);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceData.invoice_number}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};