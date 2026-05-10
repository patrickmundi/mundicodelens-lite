import * as path from "path";

import { loadDomainMap } from "../memory/domainMapLoader";

import {
  ProjectContextPayload,
} from "../types/projectContextPayload";

import {
  classifyFile,
} from "../scanner/fileClassifier";

export function buildProjectContext(
  workspaceRoot: string,
  filePath: string
): ProjectContextPayload {

  const domainMap = loadDomainMap(workspaceRoot);

  const classification = classifyFile(
    filePath,
    domainMap
  );

  const domain = classification.domain;

  if (!domain) {
    return {
      filePath,
      domain: null
    };
  }

  const metadata = domainMap[domain];

  return {
    filePath: path.relative(workspaceRoot, filePath),

    domain,

    description: metadata.description,

    riskLevel: metadata.riskLevel,

    dependsOn: metadata.dependsOn,

    aiContextHints: metadata.aiContextHints,

    keywords: metadata.keywords,

    framework: metadata.framework
  };
}