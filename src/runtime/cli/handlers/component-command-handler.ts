import path from "path";

import { ComponentScaffoldCommand } from "../../cognition/domain/component-scaffold-command";

import { ComponentScaffoldService } from "../../cognition/domain/component-scaffold-service";

import { ComponentFileWriterCommand } from "../../cognition/domain/component-file-writer-command";

export class ComponentCommandHandler {
  private readonly financeComponents = [
    "InvoiceTable",
    "InvoiceFilters",
    "InvoiceSummaryCard",
    "PaymentTable",
    "PaymentFilters",
    "PaymentSummaryCard",
    "ReceiptTable",
    "ReceiptVerificationPanel",
    "RevenueChart",
    "CollectionHealthWidget",
    "DebtExposureWidget",
    "DiscountTable",
    "DiscountPolicyTable",
  ];

  generateComponents(): void {
    const scaffoldCommand = new ComponentScaffoldCommand();

    scaffoldCommand.execute(this.financeComponents);
  }

  writeComponents(rootPath: string): void {
    const scaffoldService = new ComponentScaffoldService();

    const scaffoldResult = scaffoldService.generateFromComponents(
      this.financeComponents,
    );

    const writer = new ComponentFileWriterCommand();

    writer.execute(
      path.join(rootPath, "generated-components"),
      scaffoldResult.components.map((component) => ({
        fileName: component.fileName,
        content: component.content,
      })),
    );
  }
}
