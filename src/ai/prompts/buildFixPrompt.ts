import { baseEngineeringRules } from "./system/baseEngineeringRules";

import { getRoleEngineeringRules } from "./system/roleEngineeringRules";

export function buildFixPrompt(
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

You are a senior debugging engineer analyzing production-grade software safely.

Language:
${language}

Objectives:
- Identify bugs
- Detect risky logic
- Detect hidden edge cases
- Preserve intended behavior

Response Requirements:
- Clearly explain the issue
- Explain the root cause
- Explain the safest fix
- Mention edge cases where relevant
- Use markdown headings and bullet points

Code:
${code}
`;
}
