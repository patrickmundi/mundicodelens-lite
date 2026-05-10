import {
  ProjectContextPayload
} from "../types/projectContextPayload";

export function formatPromptContext(
  context: ProjectContextPayload
): string {

  if (!context.domain) {
    return "";
  }

  const sections: string[] = [];

  sections.push("PROJECT CONTEXT");

  sections.push(
    `Domain: ${context.domain}`
  );

  if (context.description) {

    sections.push(
      `Description: ${context.description}`
    );
  }

  if (context.riskLevel) {

    sections.push(
      `Risk Level: ${context.riskLevel}`
    );
  }

  if (
    context.dependsOn &&
    context.dependsOn.length > 0
  ) {

    sections.push(
      `Dependencies: ${context.dependsOn.join(", ")}`
    );
  }

  if (
    context.framework &&
    context.framework.length > 0
  ) {

    sections.push(
      `Framework: ${context.framework.join(", ")}`
    );
  }

  if (
    context.aiContextHints &&
    context.aiContextHints.length > 0
  ) {

    sections.push(
      "Important Engineering Notes:"
    );

    for (const hint of context.aiContextHints) {

      sections.push(`- ${hint}`);
    }
  }

  return sections.join("\n");
}