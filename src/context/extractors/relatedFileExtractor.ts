import * as fs from "fs";
import * as path from "path";

export interface RelatedFilesContext {
  relatedFiles: string[];
}

export function extractRelatedFiles(
  workspaceRoot: string,

  filePath: string,
): RelatedFilesContext {
  const relatedFiles: string[] = [];

  const normalizedPath = filePath.replace(/\\/g, "/");

  const directory = path.dirname(filePath);

  // 🔥 Django relationships

  const djangoPairs = [
    "models.py",

    "views.py",

    "urls.py",

    "forms.py",

    "serializers.py",

    "services.py",

    "admin.py",
  ];

  // 🔥 Check sibling Django files

  for (const candidate of djangoPairs) {
    const candidatePath = path.join(directory, candidate);

    if (fs.existsSync(candidatePath)) {
      if (candidatePath !== filePath) {
        relatedFiles.push(path.relative(workspaceRoot, candidatePath));
      }
    }
  }

  // 🔥 Template awareness

  if (normalizedPath.endsWith(".html")) {
    const viewsPath = path.join(directory, "views.py");

    if (fs.existsSync(viewsPath)) {
      relatedFiles.push(path.relative(workspaceRoot, viewsPath));
    }
  }

  // 🔥 React awareness

  if (normalizedPath.endsWith(".tsx")) {
    const nearbyFiles = fs.readdirSync(directory);

    for (const file of nearbyFiles) {
      if (
        file.endsWith(".css") ||
        file.endsWith(".scss") ||
        file.endsWith(".ts")
      ) {
        relatedFiles.push(
          path.relative(
            workspaceRoot,

            path.join(directory, file),
          ),
        );
      }
    }
  }

  return {
    relatedFiles: [...new Set(relatedFiles)],
  };
}
