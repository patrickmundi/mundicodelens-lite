import path from "path";

import {
  Project,
  SourceFile,
  ImportDeclaration,
  ExportDeclaration,
} from "ts-morph";

export interface ParsedImport {
  moduleSpecifier: string;

  namedImports: string[];

  defaultImport?: string;

  namespaceImport?: string;

  isTypeOnly: boolean;

  isRelative: boolean;

  isExternal: boolean;

  resolvedCandidatePath?: string;
}

export interface ParsedExport {
  moduleSpecifier?: string;

  namedExports: string[];

  isTypeOnly: boolean;
}

export interface ParsedFileDependencies {
  filePath: string;

  imports: ParsedImport[];

  exports: ParsedExport[];
}

export class ImportParser {
  private readonly project: Project;

  constructor(tsConfigFilePath?: string) {
    this.project = new Project({
      tsConfigFilePath,
      skipAddingFilesFromTsConfig: false,
    });
  }

  /**
   * Parses a TypeScript or JavaScript file
   * and extracts imports and exports.
   */
  public parseFile(filePath: string): ParsedFileDependencies {
    const normalizedPath = this.normalizePath(filePath);

    let sourceFile = this.project.getSourceFile(normalizedPath);

    if (!sourceFile) {
      sourceFile = this.project.addSourceFileAtPath(normalizedPath);
    }

    return {
      filePath: normalizedPath,

      imports: this.extractImports(sourceFile),

      exports: this.extractExports(sourceFile),
    };
  }

  /**
   * Extracts import declarations
   * from a source file.
   */
  private extractImports(sourceFile: SourceFile): ParsedImport[] {
    return sourceFile
      .getImportDeclarations()
      .map((importDecl) => this.parseImportDeclaration(importDecl));
  }

  /**
   * Extracts export declarations
   * from a source file.
   */
  private extractExports(sourceFile: SourceFile): ParsedExport[] {
    return sourceFile
      .getExportDeclarations()
      .map((exportDecl) => this.parseExportDeclaration(exportDecl));
  }

  /**
   * Parses a single import declaration.
   */
  private parseImportDeclaration(importDecl: ImportDeclaration): ParsedImport {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();

    const isRelative =
      moduleSpecifier.startsWith("./") || moduleSpecifier.startsWith("../");

    const sourceFile = importDecl.getSourceFile();

    const sourceDirectory = path.dirname(sourceFile.getFilePath());

    let resolvedCandidatePath: string | undefined;

    if (isRelative) {
      resolvedCandidatePath = this.normalizePath(
        path.resolve(sourceDirectory, moduleSpecifier),
      );
    }

    return {
      moduleSpecifier,

      namedImports: importDecl
        .getNamedImports()
        .map((namedImport) => namedImport.getName()),

      defaultImport: importDecl.getDefaultImport()?.getText(),

      namespaceImport: importDecl.getNamespaceImport()?.getText(),

      isTypeOnly: importDecl.isTypeOnly(),

      isRelative,

      isExternal: !isRelative,

      resolvedCandidatePath,
    };
  }

  /**
   * Parses a single export declaration.
   */
  private parseExportDeclaration(exportDecl: ExportDeclaration): ParsedExport {
    return {
      moduleSpecifier: exportDecl.getModuleSpecifierValue(),

      namedExports: exportDecl
        .getNamedExports()
        .map((namedExport) => namedExport.getName()),

      isTypeOnly: exportDecl.isTypeOnly(),
    };
  }

  /**
   * Normalizes paths for graph consistency.
   */
  private normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, "/");
  }
}
