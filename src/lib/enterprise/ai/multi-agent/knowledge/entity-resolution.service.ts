export class EntityResolutionService {
  private entityAliases: Record<string, string> = {
    'Gate A': 'gate_north_primary',
    'North Gate': 'gate_north_primary',
    'Entry A': 'gate_north_primary',
    'Concourse B': 'concourse_east',
    'East Concourse': 'concourse_east',
  };

  /**
   * Resolves a raw entity name from an LLM prompt into its canonical ID.
   * Prevents the Knowledge Graph from creating duplicate nodes for the same physical entity.
   */
  resolveEntity(rawName: string): string {
    const normalized = rawName.trim();
    // Fallback to normalized snake_case if no alias exists
    return this.entityAliases[normalized] || normalized.toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Used to seed the prompt so the LLMs understand the canonical naming conventions upfront.
   */
  getResolutionDirectives(): string {
    return `
ENTITY RESOLUTION DIRECTIVE:
Always use canonical entity IDs when referring to physical locations or teams.
Examples: 'Gate A' -> 'gate_north_primary', 'East Concourse' -> 'concourse_east'.
`;
  }
}

export const aiEntityResolutionService = new EntityResolutionService();
