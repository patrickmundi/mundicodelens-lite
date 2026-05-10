import * as fs from "fs";
import * as path from "path";

import { loadDomainMap } from "../memory/domainMapLoader";
import { classifyFile } from "./fileClassifier";

import {
  FileClassification
} from "../types/projectContext";

export interface WorkspaceFile {
  name: string;
  path: string;
  extension: string;
}

export interface WorkspaceScanResult {
  files: WorkspaceFile[];
  domains: string[];
  classifications: FileClassification[];
}

const IGNORED_FOLDERS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "__pycache__",
  "venv",
  ".venv",
  "_archive"
];

export function scanWorkspace(
  rootPath: string
): WorkspaceScanResult {

  const domainMap = loadDomainMap(rootPath);

  const domains = Object.keys(domainMap);

  const files: WorkspaceFile[] = [];

  const classifications: FileClassification[] = [];

  function walk(currentPath: string) {

    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {

      const fullPath = path.join(currentPath, entry);

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {

        if (IGNORED_FOLDERS.includes(entry)) {
          continue;
        }

        walk(fullPath);

      } else {

        files.push({
          name: entry,
          path: fullPath,
          extension: path.extname(entry)
        });

        const classification = classifyFile(
          fullPath,
          domainMap
        );

        classifications.push(classification);
      }
    }
  }

  walk(rootPath);

  return {
    files,
    domains,
    classifications
  };
}