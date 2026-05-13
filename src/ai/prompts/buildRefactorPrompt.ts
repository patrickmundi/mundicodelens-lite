import { baseEngineeringRules } from "./system/baseEngineeringRules";

import { getRoleEngineeringRules } from "./system/roleEngineeringRules";

export function buildRefactorPrompt(
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

You are a senior software architect performing a SAFE production-grade refactor review.

Language:
${language}

Primary Goals:
- Improve readability
- Improve maintainability
- Improve code structure
- Preserve EXACT functionality

Response Requirements:
- Explain what should improve
- Explain WHY the improvement matters
- Mention possible risks where relevant
- Use markdown headings and bullet points
- Focus on practical engineering improvements

Code:
${code}
`;
}
