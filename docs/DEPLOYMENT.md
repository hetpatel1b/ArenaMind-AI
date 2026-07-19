# ArenaMind Enterprise Deployment Guide

This guide outlines the procedure for deploying ArenaMind in an enterprise environment.

## Prerequisites

- Docker Engine 24.0+
- Docker Compose v2+
- Access to production secrets

## Deployment Flow

1. **Configuration**: Copy `.env.example` to `.env.production` and fill in secrets.
2. **Build Image**: Run `docker-compose -f docker-compose.prod.yml build`
3. **Start Platform**: Run `docker-compose -f docker-compose.prod.yml up -d`
4. **Validation**: The container performs an automatic startup validation, checking DB, Redis, and APIs.
5. **Monitoring**: View status via `/api/v1/health`.

## Updates & Rollbacks

- ArenaMind containers should be immutable.
- To update, pull latest code, rebuild, and re-run `docker-compose up -d`.
- To rollback, change image tag to previous stable tag and re-run `docker-compose up -d`.
