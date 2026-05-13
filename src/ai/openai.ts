import OpenAI from "openai";

import * as dotenv from "dotenv";

import * as path from "path";

import { buildExplainPrompt } from "./prompts/buildExplainPrompt";

import { buildRefactorPrompt } from "./prompts/buildRefactorPrompt";

import { buildFixPrompt } from "./prompts/buildFixPrompt";

import { buildOptimizePrompt } from "./prompts/buildOptimizePrompt";

import { buildDeepExplainPrompt } from "./prompts/buildDeepExplainPrompt";

import { BASE_ENGINEERING_SYSTEM_PROMPT } from "./system/baseEngineeringSystemPrompt";

// 🔥 Load environment variables

const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({
  path: envPath,
});

// 🔹 OpenAI singleton

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiInstance;
}

// 🔹 AI Function

export async function getAIResponse(
  code: string,

  action: "explain" | "deepExplain" | "refactor" | "fix" | "optimize",

  language: string,

  context?: string,

  detectedRole?: string,
): Promise<string> {
  try {
    const openai = getOpenAI();

    const contextBlock = context
      ? `

${context}

`
      : "";

    let prompt = "";

    switch (action) {
      case "explain":
        prompt = buildExplainPrompt(
          code,

          language,

          contextBlock,

          detectedRole,
        );

        break;

      case "deepExplain": {
        const summary = await getQuickSummary(
          openai,

          code,

          language,

          contextBlock,

          detectedRole,
        );

        console.log("🟢 SUMMARY:");

        console.log(summary);

        const detailedExplanation = await getDetailedExpansion(
          openai,

          code,

          language,

          summary,

          contextBlock,

          detectedRole,
        );

        console.log("🔵 DETAILED:");

        console.log(detailedExplanation);

        return `

# Quick Summary

${summary}

# Detailed Explanation

${detailedExplanation}

`;
      }

      case "refactor":
        prompt = buildRefactorPrompt(
          code,

          language,

          contextBlock,

          detectedRole,
        );

        break;

      case "fix":
        prompt = buildFixPrompt(
          code,

          language,

          contextBlock,

          detectedRole,
        );

        break;

      case "optimize":
        prompt = buildOptimizePrompt(
          code,

          language,

          contextBlock,

          detectedRole,
        );

        break;
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",

      instructions: BASE_ENGINEERING_SYSTEM_PROMPT,

      input: prompt,
    });

    console.log("✅ FULL RESPONSE:", JSON.stringify(response, null, 2));

    const text =
      (response as any).output_text ||
      (response as any).output?.[0]?.content?.[0]?.text ||
      "⚠️ No response from AI";

    console.log("✅ AI TEXT:", text);

    return text;
  } catch (error: any) {
    console.error("🔥 AI ERROR FULL:", error);

    console.error("🔥 MESSAGE:", error?.message);

    console.error("🔥 STACK:", error?.stack);

    return `❌ AI ERROR:

${error?.message || "Unknown error"}
`;
  }
}

// 🔹 QUICK SUMMARY

async function getQuickSummary(
  openai: OpenAI,

  code: string,

  language: string,

  contextBlock: string,

  detectedRole?: string,
): Promise<string> {
  const prompt = buildExplainPrompt(
    code,

    language,

    contextBlock,

    detectedRole,
  );

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",

    instructions: BASE_ENGINEERING_SYSTEM_PROMPT,

    input: prompt,
  });

  return (response as any).output_text || "⚠️ No summary generated";
}

// 🔹 DETAILED EXPANSION

async function getDetailedExpansion(
  openai: OpenAI,

  code: string,

  language: string,

  summary: string,

  contextBlock: string,

  detectedRole?: string,
): Promise<string> {
  const prompt = buildDeepExplainPrompt(
    `
Quick Summary:

${summary}

Code:

${code}
`,

    language,

    contextBlock,

    detectedRole,
  );

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",

    instructions: BASE_ENGINEERING_SYSTEM_PROMPT,

    input: prompt,
  });

  return (
    (response as any).output_text || "⚠️ No detailed explanation generated"
  );
}
