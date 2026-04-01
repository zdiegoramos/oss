import { InvoiceTable } from "./invoice-table";

export default function InvoicePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Invoice Expense Tracker</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Drop PDF or image invoices to extract and record expenses.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold text-lg">Recorded Invoices</h2>
        <InvoiceTable />
      </section>
    </main>
  );
}
