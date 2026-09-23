// Invoice status lives outside our type system: `invoiceService` types it as a
// bare `string`, so nothing catches a casing mismatch at build time.
//
// Three sites compared `status === "VERIFIED"` (uppercase), while the Payment
// model's enum in `domain/entities/paymentRequest.entity.ts` is all lowercase
// ("verified", "completed", ...). If the backend returns lowercase for invoices
// too, every paid invoice silently renders as unpaid — in the list badge, on the
// detail screen and in the exported PDF — and `InvoiceItem` would just print the
// raw word "verified" in place of a translated label.
//
// Until the backend confirms the enum, compare case-insensitively so either
// answer works. See the backend questions in the payment audit.
const PAID_STATUSES = ["verified", "completed", "paid"];

/** True when an invoice has been settled, whatever casing the backend uses. */
export const isInvoicePaid = (status?: string | null): boolean =>
  typeof status === "string" && PAID_STATUSES.includes(status.trim().toLowerCase());
