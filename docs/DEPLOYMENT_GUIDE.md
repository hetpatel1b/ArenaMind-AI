# Deployment Guide

## Infrastructure

ArenaMind is designed to be deployed as a containerized workload on Kubernetes (EKS/GKE).

## Prerequisites

- PostgreSQL 15+ (RDS/Cloud SQL recommended)
- Redis 7+ (ElastiCache/Memorystore)
- Node.js 20+

## Process

1. Build the Docker container from the `Dockerfile`.
2. Ensure database migrations are run during the CI/CD pipeline using `pnpm db:deploy`.
3. Mount environment variables securely from Vault or AWS Secrets Manager.
4. Scale stateless Node.js pods behind a Layer 7 Load Balancer.

## Health Checks

- Liveness Probe: `/api/health/liveness`
- Readiness Probe: `/api/health/readiness` (Validates DB and Redis connections)
