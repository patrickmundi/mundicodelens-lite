// 🔹 FORMATTER (UNCHANGED)
export function formatExplanationAsComment(
    text: string,
    languageId: string = "javascript"
): string {

    const lines = text
    .split("\n")

    // 🚫 Remove empty lines
    .filter(line => line.trim() !== "")

    // 🚫 Remove markdown code fences
    .filter(line => !line.trim().startsWith("```"))

    // 🚫 Remove markdown headings
    .filter(line => !line.trim().startsWith("###"))

    // 🚫 Remove repeated separators
    .filter(line => !line.trim().startsWith("---"))

    // ✨ Clean markdown bullets/symbols
    .map(line =>
        line
            .replace(/^[-*]\s*/, "")
            .replace(/^#+\s*/, "")
            .replace(/\*\*/g, "")
    );

    const preview = lines.slice(0, 8);

    let prefix = "//";
    let suffix = "";

    if (languageId === "python") {
        prefix = "#";
    }
    else if (languageId === "html") {
        prefix = "<!-- ";
        suffix = " -->";
    }
    else if (languageId === "css") {
        prefix = "/* ";
        suffix = " */";
    }

    const commented = preview.map(line => `${prefix} ${line}${suffix}`);

    return [
        `${prefix} 💡 MundiCodeLens Explanation (Preview)${suffix}`,
        ...commented,
        `${prefix} ...${suffix}`,
        `${prefix} 🔎 Run 'Full Explanation' for more${suffix}`
    ].join("\n");
}