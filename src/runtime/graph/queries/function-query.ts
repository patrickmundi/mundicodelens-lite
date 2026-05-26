import { Project } from "ts-morph";

export interface FunctionMatch {
  filePath: string;

  functionName: string;

  isAsync: boolean;

  confidence: number;
}

export class FunctionQuery {
  private readonly project: Project;

  constructor() {
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
    });
  }

  /**
   * Finds all functions
   * within a TypeScript file.
   */
  public findFunctions(filePath: string): FunctionMatch[] {
    const sourceFile = this.project.addSourceFileAtPath(filePath);

    const functions = sourceFile.getFunctions();

    return functions.map((fn) => ({
      filePath,

      functionName: fn.getName() ?? "anonymous",

      isAsync: fn.isAsync(),

      confidence: 0.9,
    }));
  }

  /**
   * Finds async functions.
   */
  public findAsyncFunctions(filePath: string): FunctionMatch[] {
    return this.findFunctions(filePath).filter((fn) => fn.isAsync);
  }

  /**
   * Finds likely bootstrap functions.
   */
  public findBootstrapFunctions(filePath: string): FunctionMatch[] {
    return this.findFunctions(filePath).filter((fn) =>
      fn.functionName.toLowerCase().includes("bootstrap"),
    );
  }

  /**
   * Finds likely handler functions.
   */
  public findHandlerFunctions(filePath: string): FunctionMatch[] {
    return this.findFunctions(filePath).filter((fn) =>
      fn.functionName.toLowerCase().includes("handler"),
    );
  }

  /**
   * Finds mutation-compatible functions.
   */
  public findMutationCompatibleFunctions(filePath: string): FunctionMatch[] {
    return this.findFunctions(filePath).filter(
      (fn) => fn.functionName !== "anonymous",
    );
  }
}
