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
    action: "explain" | "refactor" | "fix" | "optimize",
    language: string
): Promise<string> {

    try {
        const openai = getOpenAI();

        let prompt = "";

        if (action === "explain") {
            prompt = `Explain this ${language} code clearly:\n\n${code}`;
        }
        else if (action === "refactor") {
            prompt = `Refactor this ${language} code to be cleaner and more maintainable:\n\n${code}`;
        }
        else if (action === "fix") {
            prompt = `Find and fix any bugs in this ${language} code:\n\n${code}`;
        }
        else if (action === "optimize") {
            prompt = `Optimize this ${language} code for performance and readability:\n\n${code}`;
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