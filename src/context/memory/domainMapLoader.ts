import * as fs from "fs";
import * as path from "path";

import { ProjectDomainMap } from "../types/projectContext";

export function loadDomainMap(workspaceRoot: string): ProjectDomainMap {
  const domainMapPath = path.join(
    workspaceRoot,
    "docs",
    "architecture",
    "domain-map.json"
  );

  if (!fs.existsSync(domainMapPath)) {
    throw new Error(
      `domain-map.json not found at: ${domainMapPath}`
    );
  }

  const rawData = fs.readFileSync(domainMapPath, "utf-8");

  return JSON.parse(rawData);
}