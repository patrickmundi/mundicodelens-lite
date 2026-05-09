import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 🔥 Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

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

// 🔹 AI Function (UPGRADED — MULTI ACTION)
export async function getAIResponse(
    code: string,
    action: "explain" | "deepExplain" | "refactor" | "fix" | "optimize",
    language: string
): Promise<string> {

    try {
        const openai = getOpenAI();

        let prompt = "";

switch (action) {

    case "explain":

        prompt = `
You are generating a VERY SHORT code summary.

STRICT OUTPUT RULES:
- Maximum 3 bullet points
- Each bullet point must be ONE sentence only
- No introductions
- No conclusions
- No examples
- No syntax breakdown
- No teaching style
- No extra commentary
- No markdown code blocks
- Keep the entire response under 40 words

ONLY describe the main purpose of the code.

Code:
${code}
`;

        break;

    case "deepExplain": {

    const summary =
        await getQuickSummary(
            openai,
            code,
            language
        );

    console.log("🟢 SUMMARY:");
    console.log(summary);

    const detailedExplanation =
        await getDetailedExpansion(
            openai,
            code,
            language,
            summary
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

        break;

    case "refactor":

        prompt = `
Refactor this ${language} code.

Requirements:
- improve readability
- improve maintainability
- preserve functionality
- follow modern best practices

Code:
${code}
`;

        break;

    case "fix":

        prompt = `
Find and fix bugs in this ${language} code.

Requirements:
- identify problems
- explain the issues
- provide corrected code
- preserve intended functionality

Code:
${code}
`;

        break;

    case "optimize":

        prompt = `
Optimize this ${language} code.

Focus on:
- performance
- readability
- maintainability
- cleaner logic

Code:
${code}
`;

        break;
}

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
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

        return `❌ AI ERROR:\n\n${error?.message || "Unknown error"}`;
    }
}

async function getQuickSummary(
    openai: OpenAI,
    code: string,
    language: string
): Promise<string> {

    const prompt = `
You are generating a VERY SHORT code summary.

STRICT OUTPUT RULES:
- Maximum 3 bullet points
- Each bullet point must be ONE sentence only
- No introductions
- No conclusions
- No examples
- No syntax breakdown
- No teaching style
- No markdown code blocks
- Keep the entire response under 40 words

ONLY describe the main purpose of the code.

Code:
${code}
`;

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
    });

    return (
        (response as any).output_text ||
        "⚠️ No summary generated"
    );
}

async function getDetailedExpansion(
    openai: OpenAI,
    code: string,
    language: string,
    summary: string
): Promise<string> {

    const prompt = `
You are an expert senior programming instructor.

Your task is to teach this code thoroughly to a beginner developer.

IMPORTANT RULES:
- Be detailed and educational
- Explain concepts step-by-step
- Explain syntax and logic
- Explain execution flow
- Explain WHY the code works
- Explain what each important line does
- Use beginner-friendly teaching language
- Use markdown headings
- Use bullet points where helpful
- Include examples where useful
- Minimum 300 words
- DO NOT summarize briefly
- DO NOT compress the explanation

The student already saw this quick summary:

${summary}

Now expand deeply beyond that summary.

Code:
${code}
`;

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
    });

    return (
        (response as any).output_text ||
        "⚠️ No detailed explanation generated"
    );
}