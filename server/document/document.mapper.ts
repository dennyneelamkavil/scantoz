export function mapDocument(doc: any) {
  return {
    id: String(doc._id),

    title: doc.title,
    type: doc.type,
    notes: doc.notes,

    totalInvoices: doc.totalInvoices,

    companyId: String(doc.companyId),
    uploadedBy: String(doc.uploadedBy),

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
