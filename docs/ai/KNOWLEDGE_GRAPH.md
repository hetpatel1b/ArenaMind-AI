# Knowledge Graph Upgrade

The Knowledge Graph manages relational intelligence.

## Features

- **Entity Merging**: Dynamically merges properties and increases confidence when entities are observed repeatedly.
- **Confidence Decay**: Node and Edge confidence decays at 0.5% per minute to prevent stale data from driving recommendations.
- **Cypher-Ready Serialization**: Transforms graph state into Cypher-like representation to make the context easily digestible for LLMs.
- **Future-Proofing**: Prepared for drop-in Neo4j replacement.
