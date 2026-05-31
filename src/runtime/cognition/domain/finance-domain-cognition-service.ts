import * as fs from "fs";
import * as path from "path";

export interface FinanceCapability {
  name: string;
  description: string;
}

export interface FinanceDomainCognitionResult {
  success: boolean;
  discoveredModels: string[];
  capabilities: FinanceCapability[];
  diagnostics: string[];
}

export class FinanceDomainCognitionService {
  analyze(repositoryRoot: string): FinanceDomainCognitionResult {
    const diagnostics: string[] = [];

    const discoveredModels: string[] = [];

    const capabilities: FinanceCapability[] = [];

    try {
      diagnostics.push("Starting finance domain cognition.");

      const financeModelsPath = path.join(
        repositoryRoot,
        "finance",
        "models.py",
      );

      if (!fs.existsSync(financeModelsPath)) {
        diagnostics.push("finance/models.py not found.");

        return {
          success: false,
          discoveredModels,
          capabilities,
          diagnostics,
        };
      }

      const content = fs.readFileSync(financeModelsPath, "utf8");

      const modelMatches =
        content.match(/class\s+([A-Za-z0-9_]+)\(models\.Model\)/g) || [];

      for (const match of modelMatches) {
        const modelName = match
          .replace("class ", "")
          .replace("(models.Model)", "")
          .trim();

        discoveredModels.push(modelName);
      }

      diagnostics.push(`Discovered ${discoveredModels.length} finance models.`);

      if (discoveredModels.includes("Invoice")) {
        capabilities.push({
          name: "Invoice Management",
          description: "Generate, publish and manage invoices.",
        });
      }

      if (discoveredModels.includes("InvoiceItem")) {
        capabilities.push({
          name: "Invoice Itemization",
          description: "Manage detailed invoice line items.",
        });
      }

      if (discoveredModels.includes("AppliedDiscount")) {
        capabilities.push({
          name: "Applied Discounts",
          description: "Apply discounts to invoices.",
        });
      }

      if (discoveredModels.includes("DiscountPolicy")) {
        capabilities.push({
          name: "Discount Governance",
          description: "Manage reusable discount policies.",
        });
      }

      if (discoveredModels.includes("FeePayment")) {
        capabilities.push({
          name: "Payment Processing",
          description: "Track payments and collection performance.",
        });
      }

      if (discoveredModels.includes("Receipt")) {
        capabilities.push({
          name: "Receipt Management",
          description: "Generate and verify receipts.",
        });
      }

      diagnostics.push(
        `Generated ${capabilities.length} finance capabilities.`,
      );

      diagnostics.push("Finance domain cognition completed successfully.");

      return {
        success: true,
        discoveredModels,
        capabilities,
        diagnostics,
      };
    } catch (error) {
      diagnostics.push(`Finance cognition failed: ${String(error)}`);

      return {
        success: false,
        discoveredModels,
        capabilities,
        diagnostics,
      };
    }
  }
}
