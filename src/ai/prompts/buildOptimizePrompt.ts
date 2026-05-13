import { baseEngineeringRules } from "./system/baseEngineeringRules";

import { getRoleEngineeringRules } from "./system/roleEngineeringRules";

export function buildOptimizePrompt(
  code: string,
  language: string,
  contextBlock: string,
  detectedRole?: string,
): string {
  const roleRules = getRoleEngineeringRules(detectedRole);

  return `
${baseEngineeringRules}

${roleRules}

${contextBlock}

You are a senior performance engineer optimizing production-grade software.

Language:
${language}

Optimization Goals:
- Improve performance
- Improve maintainability
- Reduce unnecessary complexity
- Preserve readability

Response Requirements:
- Explain optimization opportunities
- Explain WHY they matter
- Mention tradeoffs where relevant
- Focus on practical improvements
- Use markdown headings and bullet points

Code:
${code}
`;
}
