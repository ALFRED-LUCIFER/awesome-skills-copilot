---
name: docker-compose
description: 'Generate and optimize multi-service Docker Compose configurations — dev, test, and production profiles with health checks, volumes, networks, and dependency ordering'
---

# Docker Compose Skill

Generate production-ready Docker Compose files for multi-service architectures.

## When to Use

- Setting up local development environments with multiple services
- Adding databases, caches, message queues to a project
- Creating test environments with service dependencies
- Optimizing existing docker-compose.yml files

## Rules

1. Use Compose v2 syntax (services, no `version:` key)
2. Every service MUST have a `healthcheck` defined
3. Use `depends_on` with `condition: service_healthy` — never bare `depends_on`
4. Secrets via environment variables referencing `.env` file — never hardcode
5. Named volumes for persistent data — never anonymous volumes
6. Explicit networks for service isolation
7. Pin image tags — never use `:latest` in production profiles
8. Use multi-stage Dockerfiles for application services
9. Resource limits (`mem_limit`, `cpus`) for production profile
10. Log driver configuration for production (json-file with max-size)

## Steps

1. Identify services needed (app, db, cache, queue, reverse proxy, etc.)
2. Detect existing Dockerfiles and docker-compose files in project
3. Generate `docker-compose.yml` with dev profile defaults
4. Generate `docker-compose.override.yml` for local dev (ports, volumes, hot-reload)
5. Generate `docker-compose.prod.yml` for production overrides (replicas, resources, no ports exposure)
6. Create `.env.example` with all referenced environment variables
7. Add health check endpoints to application services if missing
8. Validate with `docker compose config`

## Reference

See `./templates/` for common service configurations (PostgreSQL, Redis, RabbitMQ, Kafka, Nginx, Traefik).
