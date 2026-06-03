import {
  EngineeringCapability,
  EngineeringCapabilityRegistryService,
} from "../system/services/engineering-capability-registry-service";

export class RuntimeCapabilityRegistrationService {
  constructor(
    private readonly capabilityRegistry: EngineeringCapabilityRegistryService,
  ) {}

  /**
   * Register built-in runtime capabilities.
   */
  public registerCoreCapabilities(): void {
    const capabilities: EngineeringCapability[] = [
      {
        capabilityId: "repository-cognition",

        name: "Repository Cognition",

        category: "COGNITION",

        description: "Provides repository structure and dependency cognition.",

        enabled: true,

        version: "1.0.0",
      },

      {
        capabilityId: "governance-cognition",

        name: "Governance Cognition",

        category: "GOVERNANCE",

        description: "Provides mutation governance reasoning.",

        enabled: true,

        version: "1.0.0",
      },

      {
        capabilityId: "repository-memory",

        name: "Repository Evolution Memory",

        category: "MEMORY",

        description: "Stores repository evolution knowledge.",

        enabled: true,

        version: "1.0.0",
      },

      {
        capabilityId: "engineering-learning",

        name: "Autonomous Engineering Learning",

        category: "MEMORY",

        description: "Learns from prior engineering outcomes.",

        enabled: true,

        version: "1.0.0",
      },

      {
        capabilityId: "runtime-telemetry",

        name: "Runtime Telemetry",

        category: "OBSERVABILITY",

        description: "Captures runtime telemetry and health metrics.",

        enabled: true,

        version: "1.0.0",
      },
    ];

    for (const capability of capabilities) {
      if (!this.capabilityRegistry.hasCapability(capability.capabilityId)) {
        this.capabilityRegistry.registerCapability(capability);
      }
    }
  }
}
