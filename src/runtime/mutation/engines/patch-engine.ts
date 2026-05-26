export interface ReplaceTextPatch {
  type: "replace-text";

  search: string;

  replacement: string;
}

export interface AppendTextPatch {
  type: "append-text";

  content: string;
}

export interface PrependTextPatch {
  type: "prepend-text";

  content: string;
}

export type PatchInstruction =
  | ReplaceTextPatch
  | AppendTextPatch
  | PrependTextPatch;

export class PatchEngine {
  /**
   * Applies patch instructions
   * to file content safely.
   */
  public applyPatches(
    currentContent: string,
    patches: PatchInstruction[],
  ): string {
    let updatedContent = currentContent;

    for (const patch of patches) {
      switch (patch.type) {
        case "replace-text":
          updatedContent = this.applyReplaceTextPatch(updatedContent, patch);

          break;

        case "append-text":
          updatedContent = this.applyAppendTextPatch(updatedContent, patch);

          break;

        case "prepend-text":
          updatedContent = this.applyPrependTextPatch(updatedContent, patch);

          break;

        default:
          console.warn(`[PatchEngine] Unsupported patch type.`);
      }
    }

    return updatedContent;
  }

  /**
   * Replaces text safely.
   */
  private applyReplaceTextPatch(
    currentContent: string,
    patch: ReplaceTextPatch,
  ): string {
    if (!currentContent.includes(patch.search)) {
      console.warn(`[PatchEngine] Replace target not found.`);

      return currentContent;
    }

    return currentContent.replace(patch.search, patch.replacement);
  }

  /**
   * Appends content safely.
   */
  private applyAppendTextPatch(
    currentContent: string,
    patch: AppendTextPatch,
  ): string {
    return `${currentContent}\n${patch.content}`;
  }

  /**
   * Prepends content safely.
   */
  private applyPrependTextPatch(
    currentContent: string,
    patch: PrependTextPatch,
  ): string {
    return `${patch.content}\n${currentContent}`;
  }
}
