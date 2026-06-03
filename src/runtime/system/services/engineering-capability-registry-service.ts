export type EngineeringCapabilityCategory =
  | "COGNITION"
  | "GOVERNANCE"
  | "MEMORY"
  | "MUTATION"
  | "ORCHESTRATION"
  | "OBSERVABILITY"
  | "SCANNING"
  | "SIMULATION"
  | "SYSTEM";

export interface EngineeringCapability {
  capabilityId: string;

  name: string;

  category: EngineeringCapabilityCategory;

  description: string;

  enabled: boolean;

  version: string;

  metadata?: Record<string, unknown>;
}

export interface CapabilityRegistrationResult {
  success: boolean;

  diagnostics: string[];

  capability?: EngineeringCapability;

  error?: string;
}

export class EngineeringCapabilityRegistryService {
  private readonly capabilities = new Map<string, EngineeringCapability>();

  /**
   * Register runtime capability.
   */
  public registerCapability(
    capability: EngineeringCapability,
  ): CapabilityRegistrationResult {
    const diagnostics: string[] = [];

    if (this.capabilities.has(capability.capabilityId)) {
      return {
        success: false,

        diagnostics,

        error: `Capability '${capability.capabilityId}' already exists.`,
      };
    }

    this.capabilities.set(capability.capabilityId, capability);

    diagnostics.push(
      `Capability '${capability.name}' registered successfully.`,
    );

    return {
      success: true,

      diagnostics,

      capability,
    };
  }

  /**
   * Retrieve capability by id.
   */
  public getCapability(
    capabilityId: string,
  ): EngineeringCapability | undefined {
    return this.capabilities.get(capabilityId);
  }

  /**
   * Retrieve all capabilities.
   */
  public getCapabilities(): EngineeringCapability[] {
    return Array.from(this.capabilities.values());
  }

  /**
   * Retrieve capabilities by category.
   */
  public getCapabilitiesByCategory(
    category: EngineeringCapabilityCategory,
  ): EngineeringCapability[] {
    return this.getCapabilities().filter(
      (capability) => capability.category === category,
    );
  }

  /**
   * Enable capability.
   */
  public enableCapability(capabilityId: string): boolean {
    const capability = this.capabilities.get(capabilityId);

    if (!capability) {
      return false;
    }

    capability.enabled = true;

    return true;
  }

  /**
   * Disable capability.
   */
  public disableCapability(capabilityId: string): boolean {
    const capability = this.capabilities.get(capabilityId);

    if (!capability) {
      return false;
    }

    capability.enabled = false;

    return true;
  }

  /**
   * Determine whether capability exists.
   */
  public hasCapability(capabilityId: string): boolean {
    return this.capabilities.has(capabilityId);
  }

  /**
   * Runtime capability count.
   */
  public getCapabilityCount(): number {
    return this.capabilities.size;
  }
}
