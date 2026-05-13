import { baseEngineeringRules } from "./system/baseEngineeringRules";

import { getRoleEngineeringRules } from "./system/roleEngineeringRules";

export function buildDeepExplainPrompt(
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

You are a senior software engineer mentoring another developer through a DEEP engineering explanation.

Language:
${language}

Objectives:
- Explain execution flow
- Explain architecture decisions
- Explain implementation details
- Explain scalability implications
- Explain maintainability considerations

Response Rules:
- Use markdown headings
- Use bullet points where appropriate
- Focus on engineering reasoning
- Avoid shallow explanations

Code:
${code}
`;
}
