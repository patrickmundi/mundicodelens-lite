
export class FinanceApiClient {

  async getInvoices() {
    return fetch(
      "/api/finance/invoices/",
      {
        method: "GET",
      },
    );
  }


  async getInvoiceSummary() {
    return fetch(
      "/api/finance/invoices/summary/",
      {
        method: "GET",
      },
    );
  }


  async getPayments() {
    return fetch(
      "/api/finance/payments/",
      {
        method: "GET",
      },
    );
  }


  async getPaymentSummary() {
    return fetch(
      "/api/finance/payments/summary/",
      {
        method: "GET",
      },
    );
  }


  async getRevenueAnalytics() {
    return fetch(
      "/api/finance/revenue/analytics/",
      {
        method: "GET",
      },
    );
  }


  async getCollectionHealth() {
    return fetch(
      "/api/finance/collection-health/",
      {
        method: "GET",
      },
    );
  }


  async getDebtExposure() {
    return fetch(
      "/api/finance/debt-exposure/",
      {
        method: "GET",
      },
    );
  }

}

export const financeApi =
  new FinanceApiClient();
