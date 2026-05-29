---
name: env-config
description: 'Environment configuration management — .env templates, secrets rotation, config validation, multi-environment setup (dev/staging/prod), and 12-factor app compliance'
---

# Environment Configuration Skill

Manage environment configuration across dev, staging, and production.

## When to Use

- Setting up environment variables for a new project
- Creating .env.example templates
- Validating configuration at startup
- Managing secrets rotation
- Ensuring 12-factor app compliance for config

## Rules

1. NEVER commit .env files — only .env.example with placeholder values
2. Validate ALL required config at application startup — fail fast on missing vars
3. Use typed config parsing — never raw `process.env.X` or `os.environ["X"]` in business logic
4. Secrets MUST come from environment variables or secret managers — never config files
5. Group variables by concern: DATABASE_, AUTH_, CACHE_, FEATURE_, LOG_
6. Document every variable in .env.example with comments
7. Different environments = different values, SAME variable names
8. Default values ONLY for non-sensitive, development-appropriate settings

## Steps

1. Scan codebase for environment variable references (process.env, os.environ, IConfiguration, etc.)
2. Generate .env.example with all discovered variables, grouped and commented
3. Create config validation module that checks required vars at startup
4. Create typed config object/class that parses and validates env vars
5. Add validation to application entry point — fail with clear error messages
6. Document which vars are required vs optional, with acceptable value ranges
7. Set up per-environment config files if framework supports it (.env.development, .env.production)
8. Add .env to .gitignore if not already present

## Reference

See `./templates/` for config validation patterns per ecosystem.
