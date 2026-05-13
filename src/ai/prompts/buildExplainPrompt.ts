import { baseEngineeringRules } from "./system/baseEngineeringRules";

import { getRoleEngineeringRules } from "./system/roleEngineeringRules";

export function buildExplainPrompt(
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

You are a senior software engineer giving a SHORT code explanation.

Language:
${language}

Rules:
- Maximum 3 bullet points
- One sentence per bullet
- No introductions
- No conclusions
- No markdown code blocks
- Keep response concise
- Focus on the purpose and engineering role of the code

Code:
${code}
`;
}
