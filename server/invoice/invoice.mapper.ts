export function mapInvoice(inv: any) {
  return {
    id: String(inv._id),

    documentId: String(inv.documentId),
    companyId: String(inv.companyId),
    ledgerId: inv.ledgerId ? String(inv.ledgerId) : null,

    invoiceNumber: inv.invoiceNumber,
    invoiceDate: inv.invoiceDate,

    vendorName: inv.vendorName,

    grossAmount: inv.grossAmount,
    taxAmount: inv.taxAmount,
    totalAmount: inv.totalAmount,

    currency: inv.currency,

    file: inv.file,

    status: inv.status,
    isEdited: inv.isEdited,

    aiProcessed: inv.aiProcessed,

    createdAt: inv.createdAt,
    updatedAt: inv.updatedAt,
  };
}
