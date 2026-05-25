import * as fs from "fs";
import * as path from "path";

export interface RelatedContentResult {
  snippets: string[];
}

export function extractRelatedContent(
  workspaceRoot: string,

  relatedFiles: string[],
): RelatedContentResult {
  const snippets: string[] = [];

  for (const relativeFile of relatedFiles) {
    try {
      const absolutePath = path.join(workspaceRoot, relativeFile);

      if (!fs.existsSync(absolutePath)) {
        continue;
      }

      const content = fs.readFileSync(absolutePath, "utf-8");

      // 🔥 Keep lightweight for token safety

      const snippet = content.slice(0, 2000);

      snippets.push(
        `FILE: ${relativeFile}

${snippet}`,
      );
    } catch (error) {
      console.error("Failed loading related file:", relativeFile);
    }
  }

  return {
    snippets,
  };
}
