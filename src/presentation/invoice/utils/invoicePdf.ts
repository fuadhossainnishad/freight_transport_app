import { generatePDF } from "react-native-html-to-pdf";
import Share from "react-native-share";
import { saveDocuments, errorCodes, isErrorWithCode } from "@react-native-documents/picker";
import { InvoiceDetail } from "../../../data/services/invoiceService";

const CURRENCY = "€";

const fmtDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtAmount = (value?: number | null) => `${CURRENCY}${(value ?? 0).toFixed(2)}`;

const esc = (value: unknown) =>
    String(value ?? "—")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const safeFileName = (invoiceNo: string) =>
    `Invoice_${(invoiceNo || "invoice").replace(/[^a-zA-Z0-9-_]/g, "")}`;

export const buildInvoiceHtml = (invoice: InvoiceDetail): string => {
    const { invoice_summary, shipment_info, cost_breakdown } = invoice;
    const isPaid = invoice.status === "VERIFIED";
    const statusLabel = isPaid ? "Paid" : invoice.status;
    const statusColor = isPaid ? "#15803d" : "#c2410c";
    const statusBg = isPaid ? "#dcfce7" : "#ffedd5";

    const weight = shipment_info.weight != null ? `${esc(shipment_info.weight)} kg` : "—";

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 32px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #036BB4; padding-bottom: 16px; }
  .brand { font-size: 22px; font-weight: 700; color: #036BB4; }
  .invoice-no { font-size: 13px; color: #6b7280; margin-top: 4px; }
  .status { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; color: ${statusColor}; background: ${statusBg}; }
  .section-title { font-size: 14px; font-weight: 700; color: #374151; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.4px; }
  .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #f9fafb; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .row .label { color: #6b7280; }
  .row .value { color: #111827; font-weight: 500; text-align: right; max-width: 60%; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
  td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
  td.amount { text-align: right; font-weight: 500; }
  tr.total td { background: #f3f4f6; font-weight: 700; border-bottom: none; }
  .footer { margin-top: 32px; font-size: 11px; color: #9ca3af; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Invoice Summary</div>
      <div class="invoice-no">Invoice ${esc(invoice.invoice_no)}</div>
    </div>
    <div class="status">${esc(statusLabel)}</div>
  </div>

  <div class="section-title">Shipment Information</div>
  <div class="card">
    <div class="row"><span class="label">Shipment Title</span><span class="value">${esc(shipment_info.shipment_title)}</span></div>
    <div class="row"><span class="label">Category</span><span class="value">${esc(shipment_info.category)}</span></div>
    <div class="row"><span class="label">Weight</span><span class="value">${weight}</span></div>
    <div class="row"><span class="label">Issued On</span><span class="value">${fmtDate(invoice_summary.issued_on)}</span></div>
    <div class="row"><span class="label">Due Date</span><span class="value">${fmtDate(invoice_summary.due_date)}</span></div>
    <div class="row"><span class="label">Delivery Date</span><span class="value">${fmtDate(shipment_info.date_of_delivery)}</span></div>
  </div>

  <div class="section-title">Addresses & Payment</div>
  <div class="card">
    <div class="row"><span class="label">Pickup Address</span><span class="value">${esc(shipment_info.pickup_address)}</span></div>
    <div class="row"><span class="label">Delivery Address</span><span class="value">${esc(shipment_info.delivery_address)}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">${esc(invoice_summary.payment_method)}</span></div>
  </div>

  <div class="section-title">Cost Breakdown</div>
  <table>
    <tr><td>Transport Fee</td><td class="amount">${fmtAmount(cost_breakdown.transport_fee)}</td></tr>
    <tr><td>Platform Service Fee</td><td class="amount">${fmtAmount(cost_breakdown.platform_fee)}</td></tr>
    <tr class="total"><td>Total</td><td class="amount">${fmtAmount(cost_breakdown.total)}</td></tr>
  </table>

  <div class="footer">Generated on ${fmtDate(new Date().toISOString())}</div>
</body>
</html>`;
};

/**
 * Renders the invoice to a PDF file on disk and returns the absolute file path.
 */
export const generateInvoicePdf = async (invoice: InvoiceDetail): Promise<string> => {
    // NOTE: do NOT pass `directory: "Documents"`. That writes to getExternalFilesDir,
    // which react-native-share's FileProvider (share_download_paths.xml) does not expose,
    // causing FileProvider.getUriForFile to fail and Share.open to crash with
    // "Uri.getScheme() on a null object reference". Omitting `directory` writes the PDF
    // to the app cache dir, which the FileProvider serves via its <cache-path>.
    const { filePath } = await generatePDF({
        html: buildInvoiceHtml(invoice),
        fileName: safeFileName(invoice.invoice_no),
        base64: false,
    });
    if (!filePath) {
        throw new Error("Failed to generate the invoice PDF");
    }
    return filePath;
};

const toFileUri = (filePath: string) =>
    filePath.startsWith("file://") ? filePath : `file://${filePath}`;

export type DownloadResult = "saved" | "cancelled";

/**
 * Generates the PDF and opens the native "Save as" dialog so the user can save
 * the file to the device (Downloads / Files). This writes a real file on the
 * device via the Storage Access Framework — not just a share sheet.
 * Returns "cancelled" if the user dismisses the dialog.
 */
export const downloadInvoicePdf = async (invoice: InvoiceDetail): Promise<DownloadResult> => {
    const filePath = await generateInvoicePdf(invoice);
    try {
        const [result] = await saveDocuments({
            sourceUris: [encodeURI(toFileUri(filePath))],
            mimeType: "application/pdf",
            fileName: `${safeFileName(invoice.invoice_no)}.pdf`,
            copy: true,
        });
        if (result?.error) {
            throw new Error(result.error);
        }
        return "saved";
    } catch (err) {
        if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
            return "cancelled";
        }
        throw err;
    }
};

/**
 * Generates the PDF and opens the share sheet, from which the user can
 * select the system Print action / a printer app.
 */
export const printInvoicePdf = async (invoice: InvoiceDetail): Promise<void> => {
    const filePath = await generateInvoicePdf(invoice);
    await Share.open({
        url: toFileUri(filePath),
        type: "application/pdf",
        filename: safeFileName(invoice.invoice_no),
        title: "Print invoice",
        message: "Print invoice",
        failOnCancel: false,
    });
};
