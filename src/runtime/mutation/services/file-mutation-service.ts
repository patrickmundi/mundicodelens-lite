import fs from "fs";

import path from "path";

export interface FileMutationResult {
  success: boolean;

  filePath: string;

  backupPath?: string;

  error?: unknown;
}

export class FileMutationService {
  /**
   * Reads file content.
   */
  public readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  /**
   * Writes content to file.
   */
  public writeFile(filePath: string, content: string): void {
    fs.writeFileSync(filePath, content, "utf-8");
  }

  /**
   * Creates a backup copy
   * before mutation.
   */
  public createBackup(filePath: string): string {
    const backupDirectory = path.resolve(
      process.cwd(),
      ".mundicodelens",
      "backups",
    );

    fs.mkdirSync(backupDirectory, {
      recursive: true,
    });

    const timestamp = Date.now();

    const fileName = path.basename(filePath);

    const backupPath = path.resolve(
      backupDirectory,
      `${timestamp}-${fileName}.bak`,
    );

    fs.copyFileSync(filePath, backupPath);

    return backupPath;
  }

  /**
   * Restores file from backup.
   */
  public restoreBackup(backupPath: string, targetFilePath: string): void {
    fs.copyFileSync(backupPath, targetFilePath);
  }

  /**
   * Safely mutates file content.
   */
  public mutate(
    filePath: string,
    transformer: (currentContent: string) => string,
  ): FileMutationResult {
    let backupPath: string | undefined;

    try {
      const currentContent = this.readFile(filePath);

      backupPath = this.createBackup(filePath);

      const mutatedContent = transformer(currentContent);

      this.writeFile(filePath, mutatedContent);

      console.log(
        `[FileMutationService] File mutated successfully: ${filePath}`,
      );

      return {
        success: true,

        filePath,

        backupPath,
      };
    } catch (error) {
      console.error("[FileMutationService] Mutation failed:", error);

      if (backupPath) {
        try {
          this.restoreBackup(backupPath, filePath);

          console.log(`[FileMutationService] Backup restored: ${filePath}`);
        } catch (restoreError) {
          console.error(
            "[FileMutationService] Backup restoration failed:",
            restoreError,
          );
        }
      }

      return {
        success: false,

        filePath,

        backupPath,

        error,
      };
    }
  }
}
