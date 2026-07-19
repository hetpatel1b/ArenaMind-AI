import { INTELLIGENCE_CONFIG } from '@/config/intelligence';

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  confidence: number;
  status: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  strength: number;
  animated: boolean;
}

export class GraphLimiter {
  public nodeLimit: number;
  public edgeLimit: number;

  constructor(options?: { nodeLimit?: number; edgeLimit?: number }) {
    this.nodeLimit = options?.nodeLimit || INTELLIGENCE_CONFIG.MAX_GRAPH_NODES;
    this.edgeLimit = options?.edgeLimit || INTELLIGENCE_CONFIG.MAX_GRAPH_EDGES;
  }

  canAddNode(currentCount: number): boolean {
    return currentCount < this.nodeLimit;
  }

  canAddEdge(currentCount: number): boolean {
    return currentCount < this.edgeLimit;
  }
}

export class GraphSerializer {
  static toPayload(nodes: Map<string, GraphNode>, edges: GraphEdge[]) {
    // In the future, this can be refactored to support chunked streaming
    // without altering the builder.
    return {
      nodes: Array.from(nodes.values()),
      edges,
    };
  }
}

export class GraphBuilder {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];
  private limiter: GraphLimiter;

  constructor(limiter: GraphLimiter) {
    this.limiter = limiter;
  }

  build(incidents: SafeAny[], cameras: SafeAny[], units: SafeAny[]) {
    // Smart Prioritization: Critical Incidents > High Severity Incidents
    const sortedIncidents = [...incidents].sort((a, b) => b.severityTier - a.severityTier);

    // Add Incidents
    for (let idx = 0; idx < sortedIncidents.length; idx++) {
      if (!this.limiter.canAddNode(this.nodes.size)) break;
      const inc = sortedIncidents[idx];
      this.nodes.set(`inc-${inc.id}`, {
        id: `inc-${inc.id}`,
        type: 'Incident',
        label: inc.title,
        x: 30 + idx * 20,
        y: 40 + idx * 15,
        confidence: 90 + inc.severityTier * 3,
        status: inc.severityTier > 2 ? 'critical' : 'elevated',
      });
    }

    // Add Cameras
    for (let idx = 0; idx < cameras.length; idx++) {
      if (!this.limiter.canAddNode(this.nodes.size)) break;
      const cam = cameras[idx];
      const camId = `cam-${cam.id}`;

      this.nodes.set(camId, {
        id: camId,
        type: 'Asset',
        label: cam.name,
        x: 10 + idx * 10,
        y: 20 + idx * 10,
        confidence: 98,
        status: 'nominal',
      });

      // Link cameras to incidents safely (only if target node was retained)
      if (sortedIncidents.length > 0) {
        const targetId = `inc-${sortedIncidents[0].id}`;
        if (this.nodes.has(targetId) && this.limiter.canAddEdge(this.edges.length)) {
          this.edges.push({
            id: `e-${camId}-${targetId}`,
            sourceId: camId,
            targetId: targetId,
            label: 'detects',
            strength: 0.8,
            animated: true,
          });
        }
      }
    }

    // Add Workforce Units
    for (let idx = 0; idx < units.length; idx++) {
      if (!this.limiter.canAddNode(this.nodes.size)) break;
      const unit = units[idx];
      const unitId = `unit-${unit.id}`;

      this.nodes.set(unitId, {
        id: unitId,
        type: 'Person',
        label: unit.name,
        x: 80 - idx * 15,
        y: 80 - idx * 10,
        confidence: 99,
        status: 'nominal',
      });

      // Link units to incidents safely (only if target node was retained)
      if (sortedIncidents.length > 0) {
        const targetId = `inc-${sortedIncidents[0].id}`;
        if (this.nodes.has(targetId) && this.limiter.canAddEdge(this.edges.length)) {
          this.edges.push({
            id: `e-${unitId}-${targetId}`,
            sourceId: unitId,
            targetId: targetId,
            label: 'responding',
            strength: 0.95,
            animated: true,
          });
        }
      }
    }

    return GraphSerializer.toPayload(this.nodes, this.edges);
  }
}
