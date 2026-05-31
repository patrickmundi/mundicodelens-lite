export interface FinanceUiTemplate {
  componentName: string;
  template: string;
}

export class FinanceUiTemplateService {
  getTemplate(componentName: string): FinanceUiTemplate | null {
    const financeTemplates: Record<string, string> = {
      InvoiceTable: this.buildInvoiceTable(),

      PaymentTable: this.buildPaymentTable(),

      RevenueChart: this.buildRevenueChart(),

      CollectionHealthWidget: this.buildCollectionHealthWidget(),

      DebtExposureWidget: this.buildDebtExposureWidget(),

      InvoiceSummaryCard: this.buildInvoiceSummaryCard(),

      PaymentSummaryCard: this.buildPaymentSummaryCard(),
    };

    const template = financeTemplates[componentName];

    if (!template) {
      return null;
    }

    return {
      componentName,
      template,
    };
  }

  private buildInvoiceTable(): string {
    return `
export default function InvoiceTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">
        Invoice Management
      </h3>

      <table className="w-full">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Student</th>
            <th>Amount Due</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>INV-001</td>
            <td>John Doe</td>
            <td>₦120,000</td>
            <td>₦20,000</td>
            <td>Partial</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
`;
  }

  private buildPaymentTable(): string {
    return `
export default function PaymentTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">
        Payment Transactions
      </h3>

      <table className="w-full">
        <thead>
          <tr>
            <th>Receipt No</th>
            <th>Student</th>
            <th>Amount Paid</th>
            <th>Method</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>RCT-001</td>
            <td>John Doe</td>
            <td>₦50,000</td>
            <td>Transfer</td>
            <td>2026-05-30</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
`;
  }

  private buildRevenueChart(): string {
    return `
"use client";

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">
        Revenue Trend
      </h3>

      <div className="h-64 flex items-center justify-center text-gray-500">
        Revenue Analytics Chart
      </div>
    </div>
  );
}
`;
  }

  private buildCollectionHealthWidget(): string {
    return `
export default function CollectionHealthWidget() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <h3 className="font-semibold">
        Collection Health
      </h3>

      <div className="text-3xl font-bold mt-3">
        82%
      </div>

      <p className="text-green-700 mt-2">
        Strong Collection Performance
      </p>
    </div>
  );
}
`;
  }

  private buildDebtExposureWidget(): string {
    return `
export default function DebtExposureWidget() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <h3 className="font-semibold">
        Debt Exposure
      </h3>

      <div className="text-3xl font-bold mt-3">
        ₦450,000
      </div>

      <p className="text-red-700 mt-2">
        Outstanding Balances
      </p>
    </div>
  );
}
`;
  }

  private buildInvoiceSummaryCard(): string {
    return `
export default function InvoiceSummaryCard() {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <h3 className="font-semibold">
        Total Invoices
      </h3>

      <div className="text-3xl font-bold mt-3">
        124
      </div>
    </div>
  );
}
`;
  }

  private buildPaymentSummaryCard(): string {
    return `
export default function PaymentSummaryCard() {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <h3 className="font-semibold">
        Total Payments
      </h3>

      <div className="text-3xl font-bold mt-3">
        ₦4,500,000
      </div>
    </div>
  );
}
`;
  }
}
