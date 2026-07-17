export interface KGNode {
  id: string;
  label: string; // e.g. 'Person', 'Incident', 'Zone'
  properties: Record<string, any>;
  confidence: number;
  lastUpdated?: number;
}

export interface KGEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string; // e.g. 'LOCATED_IN', 'CAUSED_BY'
  properties: Record<string, any>;
  confidence: number;
  weight: number;
  isHistorical?: boolean;
  lastUpdated?: number;
}

export class KnowledgeGraphService {
  private nodes: Map<string, KGNode> = new Map();
  private edges: Map<string, KGEdge> = new Map();

  // Neo4j future-proofing placeholder
  private readonly DECAY_RATE_PER_MINUTE = 0.5; // 0.5% confidence loss per minute

  initialize() {
    this.nodes.clear();
    this.edges.clear();
  }

  addNode(node: KGNode) {
    node.lastUpdated = Date.now();

    if (this.nodes.has(node.id)) {
      // Entity Merging & Dynamic Confidence Updates
      const existing = this.nodes.get(node.id)!;
      existing.properties = { ...existing.properties, ...node.properties };
      // Confidence boosts when seen multiple times
      existing.confidence = Math.min(100, existing.confidence + node.confidence * 0.2);
      existing.lastUpdated = node.lastUpdated;
      this.nodes.set(node.id, existing);
    } else {
      this.nodes.set(node.id, node);
    }
  }

  addEdge(edge: KGEdge) {
    edge.lastUpdated = Date.now();
    edge.weight = edge.weight || 1;

    if (this.edges.has(edge.id)) {
      const existing = this.edges.get(edge.id)!;
      existing.confidence = Math.min(100, existing.confidence + edge.confidence * 0.2);
      existing.weight += 0.1;
      existing.lastUpdated = edge.lastUpdated;
      this.edges.set(edge.id, existing);
    } else {
      this.edges.set(edge.id, edge);
    }
  }

  /**
   * Applies temporal decay to all nodes and edges.
   */
  public applyConfidenceDecay() {
    const now = Date.now();

    this.nodes.forEach((node, key) => {
      if (node.lastUpdated) {
        const minutesPassed = (now - node.lastUpdated) / 60000;
        node.confidence = Math.max(0, node.confidence - minutesPassed * this.DECAY_RATE_PER_MINUTE);
      }
      if (node.confidence < 10) this.nodes.delete(key);
    });

    this.edges.forEach((edge, key) => {
      if (edge.lastUpdated) {
        const minutesPassed = (now - edge.lastUpdated) / 60000;
        edge.confidence = Math.max(0, edge.confidence - minutesPassed * this.DECAY_RATE_PER_MINUTE);
      }
      if (edge.confidence < 10 && !edge.isHistorical) this.edges.delete(key);
    });
  }

  getGraphData() {
    this.applyConfidenceDecay();
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    };
  }

  /**
   * Translates graph into Cypher-like structure for LLM context.
   */
  serializeForPrompt(): string {
    this.applyConfidenceDecay();
    let output = 'KNOWLEDGE GRAPH STATE (CYPHER-READY):\n';

    if (this.nodes.size === 0) return output + 'No entities detected yet.\n';

    output += 'Entities:\n';
    this.nodes.forEach((node) => {
      output += `- (n:${node.label} {id: "${node.id}", conf: ${node.confidence.toFixed(1)}%})\n`;
      Object.entries(node.properties).forEach(([k, v]) => {
        output += `  * ${k}: ${v}\n`;
      });
    });

    output += 'Relationships:\n';
    this.edges.forEach((edge) => {
      const histMarker = edge.isHistorical ? ' [HISTORICAL]' : '';
      output += `- (${edge.sourceId}) -[r:${edge.type} {weight: ${edge.weight.toFixed(2)}, conf: ${edge.confidence.toFixed(1)}%}]-> (${edge.targetId})${histMarker}\n`;
    });

    return output;
  }
}

export const aiKnowledgeGraphService = new KnowledgeGraphService();
