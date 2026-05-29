---
name: logging-observability
description: 'Set up structured logging, distributed tracing, and metrics collection — Serilog, Pino, Winston, OpenTelemetry, Prometheus, Grafana patterns for any stack'
---

# Logging & Observability Skill

Set up the three pillars of observability: logs, traces, metrics.

## When to Use

- Adding structured logging to a project
- Setting up distributed tracing (OpenTelemetry)
- Configuring metrics collection (Prometheus/StatsD)
- Standardizing log formats across microservices
- Adding correlation IDs for request tracing

## Rules

1. Structured JSON logs ONLY — never unstructured text in production
2. Every log entry MUST include: timestamp, level, message, correlationId, service name
3. NEVER log sensitive data (passwords, tokens, PII, credit cards)
4. Use log levels correctly: ERROR (action needed), WARN (degraded), INFO (business events), DEBUG (dev only)
5. OpenTelemetry is the standard — prefer OTLP exporters over vendor-specific
6. Correlation ID MUST propagate across service boundaries (HTTP headers, message headers)
7. Metrics: USE (Utilization, Saturation, Errors) and RED (Rate, Errors, Duration) patterns
8. Health check endpoints: `/health` (liveness), `/ready` (readiness)

## Steps

1. Detect project language and existing logging setup
2. Install structured logging library (Serilog/.NET, Pino/Node, structlog/Python, zerolog/Go)
3. Configure JSON formatter with standard fields (timestamp, level, message, correlationId, service)
4. Add correlation ID middleware (extract from `X-Correlation-Id` header or generate UUID)
5. Set up OpenTelemetry SDK with OTLP exporter for traces
6. Add instrumentation for HTTP clients, database queries, message consumers
7. Configure metrics endpoint (Prometheus `/metrics` or OTLP)
8. Add health check endpoints (`/health`, `/ready`) with dependency checks

## Reference

See `./templates/` for per-ecosystem setup (dotnet-serilog, node-pino, python-structlog, go-zerolog).
