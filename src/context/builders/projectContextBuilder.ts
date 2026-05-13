import * as path from "path";

import { loadDomainMap } from "../memory/domainMapLoader";

import { loadEngineeringMemory } from "../memory/engineeringMemoryLoader";
import { ProjectContextPayload } from "../types/projectContextPayload";

import { classifyFile } from "../scanner/fileClassifier";

export function buildProjectContext(
  workspaceRoot: string,
  filePath: string,
): ProjectContextPayload {
  const domainMap = loadDomainMap(workspaceRoot);

  const engineeringMemory = loadEngineeringMemory(workspaceRoot);

  const classification = classifyFile(filePath, domainMap);

  const domain = classification.domain;

  const normalizedPath = filePath.replace(/\\/g, "/");

  // 🔥 FILE ROLE DETECTION

  let detectedRole = "general";

  // Django

  if (normalizedPath.includes("/models.py")) {
    detectedRole = "django-model";
  } else if (normalizedPath.includes("/views.py")) {
    detectedRole = "django-view";
  } else if (normalizedPath.includes("/admin.py")) {
    detectedRole = "django-admin";
  } else if (normalizedPath.includes("/urls.py")) {
    detectedRole = "django-routing";
  } else if (normalizedPath.includes("/forms.py")) {
    detectedRole = "django-form";
  } else if (normalizedPath.includes("/serializers.py")) {
    detectedRole = "django-serializer";
  } else if (normalizedPath.includes("/services/")) {
    detectedRole = "service-layer";
  } else if (normalizedPath.includes("/utils.py")) {
    detectedRole = "utility-module";
  }

  // Frontend
  else if (normalizedPath.endsWith(".html")) {
    detectedRole = "template";
  } else if (
    normalizedPath.endsWith(".css") ||
    normalizedPath.endsWith(".scss")
  ) {
    detectedRole = "style-layer";
  } else if (normalizedPath.endsWith(".tsx")) {
    detectedRole = "react-component";
  } else if (normalizedPath.endsWith(".ts")) {
    detectedRole = "typescript-module";
  } else if (normalizedPath.endsWith(".js")) {
    detectedRole = "javascript-module";
  }

  // 🔥 NO DOMAIN FOUND

  if (!domain) {
    return {
      filePath: path.relative(workspaceRoot, filePath),

      domain: null,

      detectedRole,

      globalEngineeringRules: engineeringMemory.globalEngineeringRules,

      projectPatterns: engineeringMemory.projectPatterns,

      criticalBusinessRules: engineeringMemory.criticalBusinessRules,
    };
  }

  const metadata = domainMap[domain];

  // 🔥 FINAL PAYLOAD

  return {
    filePath: path.relative(workspaceRoot, filePath),

    domain,

    detectedRole,

    description: metadata.description,

    riskLevel: metadata.riskLevel,

    dependsOn: metadata.dependsOn,

    aiContextHints: metadata.aiContextHints,

    keywords: metadata.keywords,

    framework: metadata.framework,

    globalEngineeringRules: engineeringMemory.globalEngineeringRules,

    projectPatterns: engineeringMemory.projectPatterns,

    criticalBusinessRules: engineeringMemory.criticalBusinessRules,
  };
}
