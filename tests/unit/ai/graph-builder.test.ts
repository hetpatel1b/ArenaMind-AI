import { describe, it, expect } from 'vitest';
import {
  GraphBuilder,
  GraphLimiter,
  GraphSerializer,
} from '../../../src/app/api/v1/intelligence/graph-builder';

describe('GraphLimiter', () => {
  it('respects default limits from INTELLIGENCE_CONFIG', () => {
    // Assuming defaults are high, we test fallback behavior or passed in values
    const limiter = new GraphLimiter();
    expect(limiter.nodeLimit).toBeGreaterThan(0);
    expect(limiter.edgeLimit).toBeGreaterThan(0);
  });

  it('respects custom limits provided via constructor', () => {
    const limiter = new GraphLimiter({ nodeLimit: 5, edgeLimit: 2 });
    expect(limiter.nodeLimit).toBe(5);
    expect(limiter.edgeLimit).toBe(2);
  });

  it('canAddNode returns true when currentCount is below nodeLimit', () => {
    const limiter = new GraphLimiter({ nodeLimit: 2 });
    expect(limiter.canAddNode(0)).toBe(true);
    expect(limiter.canAddNode(1)).toBe(true);
    expect(limiter.canAddNode(2)).toBe(false);
  });

  it('canAddEdge returns true when currentCount is below edgeLimit', () => {
    const limiter = new GraphLimiter({ edgeLimit: 1 });
    expect(limiter.canAddEdge(0)).toBe(true);
    expect(limiter.canAddEdge(1)).toBe(false);
  });
});

describe('GraphSerializer', () => {
  it('serializes nodes and edges to expected payload format', () => {
    const nodes = new Map();
    nodes.set('node1', {
      id: 'node1',
      type: 'Person',
      label: 'Test Person',
      x: 0,
      y: 0,
      confidence: 100,
      status: 'nominal',
    });
    const edges = [
      {
        id: 'e1',
        sourceId: 'node1',
        targetId: 'node2',
        label: 'detects',
        strength: 0.8,
        animated: true,
      },
    ];

    const payload = GraphSerializer.toPayload(nodes, edges);
    expect(payload.nodes[0]!.id).toBe('node1');
    expect(payload.edges).toHaveLength(1);
    expect(payload.edges[0]!.id).toBe('e1');
  });
});

describe('GraphBuilder', () => {
  it('builds an empty graph when provided empty datasets', () => {
    const limiter = new GraphLimiter();
    const builder = new GraphBuilder(limiter);
    const payload = builder.build([], [], []);

    expect(payload.nodes).toHaveLength(0);
    expect(payload.edges).toHaveLength(0);
  });

  it('builds a graph with nodes and correctly categorizes status and confidence', () => {
    const limiter = new GraphLimiter({ nodeLimit: 100, edgeLimit: 100 });
    const builder = new GraphBuilder(limiter);

    const incidents = [
      { id: '1', title: 'Critical Fire', severityTier: 4 },
      { id: '2', title: 'Minor Issue', severityTier: 1 },
    ];
    const cameras = [{ id: 'cam1', name: 'Gate Camera' }];
    const units = [{ id: 'unit1', name: 'Medical Team 1' }];

    const payload = builder.build(incidents, cameras, units);

    // Nodes: 2 incidents + 1 camera + 1 unit = 4 nodes
    expect(payload.nodes).toHaveLength(4);

    // Edges: camera connects to critical incident (inc-1), unit connects to critical incident (inc-1)
    expect(payload.edges).toHaveLength(2);

    const criticalIncNode = payload.nodes.find((n) => n.id === 'inc-1')!;
    expect(criticalIncNode).toBeDefined();
    expect(criticalIncNode.status).toBe('critical'); // severity 4 > 2
    expect(criticalIncNode.confidence).toBe(102); // 90 + 4 * 3

    const minorIncNode = payload.nodes.find((n) => n.id === 'inc-2')!;
    expect(minorIncNode).toBeDefined();
    expect(minorIncNode.status).toBe('elevated'); // severity 1 <= 2
    expect(minorIncNode.confidence).toBe(93); // 90 + 1 * 3

    const edgeCam = payload.edges.find((e) => e.sourceId === 'cam-cam1');
    expect(edgeCam?.targetId).toBe('inc-1'); // Should link to highest severity incident
  });

  it('respects GraphLimiter node constraints', () => {
    const limiter = new GraphLimiter({ nodeLimit: 2, edgeLimit: 100 });
    const builder = new GraphBuilder(limiter);

    const incidents = [
      { id: '1', title: 'Critical Fire', severityTier: 4 },
      { id: '2', title: 'Minor Issue', severityTier: 1 },
    ];
    const cameras = [{ id: 'cam1', name: 'Gate Camera' }];
    const units = [{ id: 'unit1', name: 'Medical Team 1' }];

    const payload = builder.build(incidents, cameras, units);

    // Only the first 2 nodes (the incidents) should be added because nodeLimit = 2
    expect(payload.nodes).toHaveLength(2);
    expect(payload.nodes.find((n) => n.id === 'inc-1')).toBeDefined();
    expect(payload.nodes.find((n) => n.id === 'inc-2')).toBeDefined();

    // No cameras or units, so no edges
    expect(payload.edges).toHaveLength(0);
  });

  it('respects GraphLimiter edge constraints', () => {
    const limiter = new GraphLimiter({ nodeLimit: 100, edgeLimit: 1 });
    const builder = new GraphBuilder(limiter);

    const incidents = [{ id: '1', title: 'Critical Fire', severityTier: 4 }];
    const cameras = [{ id: 'cam1', name: 'Gate Camera' }];
    const units = [{ id: 'unit1', name: 'Medical Team 1' }];

    const payload = builder.build(incidents, cameras, units);

    expect(payload.nodes).toHaveLength(3);

    // We try to add an edge for the camera and for the unit, but edgeLimit is 1
    expect(payload.edges).toHaveLength(1);
    expect(payload.edges[0]!.sourceId).toBe('cam-cam1'); // First one wins
  });
});
