export interface RuntimeCommandHandler {
  execute: () => Promise<void> | void;
}

export class RuntimeCommandDispatcher {
  private readonly handlers = new Map<string, RuntimeCommandHandler>();

  register(command: string, handler: RuntimeCommandHandler): void {
    this.handlers.set(command, handler);
  }

  has(command: string): boolean {
    return this.handlers.has(command);
  }

  async dispatch(command: string): Promise<void> {
    const handler = this.handlers.get(command);

    if (!handler) {
      throw new Error(`Unknown command: ${command}`);
    }

    await handler.execute();
  }

  getCommands(): string[] {
    return [...this.handlers.keys()];
  }
}
