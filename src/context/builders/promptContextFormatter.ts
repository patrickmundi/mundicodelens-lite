import { ProjectContextPayload } from "../types/projectContextPayload";

export function formatPromptContext(context: ProjectContextPayload): string {
  if (!context.domain) {
    return "";
  }

  const sections: string[] = [];

  sections.push("========== PROJECT CONTEXT ==========");

  // 🔥 Core domain info

  sections.push(`Domain: ${context.domain}`);

  // 🔥 File role awareness

  if (context.detectedRole) {
    sections.push(`File Role: ${context.detectedRole}`);
  }

  // 🔥 Description

  if (context.description) {
    sections.push(`Description: ${context.description}`);
  }

  // 🔥 Risk awareness

  if (context.riskLevel) {
    sections.push(`Risk Level: ${context.riskLevel}`);
  }

  // 🔥 Dependencies

  if (context.dependsOn && context.dependsOn.length > 0) {
    sections.push(`Dependencies: ${context.dependsOn.join(", ")}`);
  }

  // 🔥 Framework awareness

  if (context.framework && context.framework.length > 0) {
    sections.push(`Frameworks: ${context.framework.join(", ")}`);
  }

  // 🔥 Keywords

  if (context.keywords && context.keywords.length > 0) {
    sections.push(`Keywords: ${context.keywords.join(", ")}`);
  }

  // 🔥 Engineering guidance

  if (context.aiContextHints && context.aiContextHints.length > 0) {
    sections.push("Engineering Guidance:");

    for (const hint of context.aiContextHints) {
      sections.push(`- ${hint}`);
    }
  }

  // 🔥 Global engineering memory

  if (
    context.globalEngineeringRules &&
    context.globalEngineeringRules.length > 0
  ) {
    sections.push("Global Engineering Rules:");

    for (const rule of context.globalEngineeringRules) {
      sections.push(`- ${rule}`);
    }
  }

  // 🔥 Project patterns

  if (context.projectPatterns && context.projectPatterns.length > 0) {
    sections.push("Project Patterns:");

    for (const pattern of context.projectPatterns) {
      sections.push(`- ${pattern}`);
    }
  }

  // 🔥 Critical business rules

  if (
    context.criticalBusinessRules &&
    context.criticalBusinessRules.length > 0
  ) {
    sections.push("Critical Business Rules:");

    for (const rule of context.criticalBusinessRules) {
      sections.push(`- ${rule}`);
    }
  }

  sections.push("=====================================");

  return sections.join("\n");
}
