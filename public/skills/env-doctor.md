---
name: env-doctor
description: Diagnoses and fixes project environment issues. Use when the user says something is not working, a project will not start, dependencies fail to install, environment variables are missing, or ports are already in use. Checks Node, Python, Docker, env vars, ports, and dependencies systematically.
---

# Env Doctor

Systematically diagnose why a project is not running. Check everything a developer would check manually, but faster and without forgetting steps.

## Workflow

1. **Identify the project type**: Read the root directory to determine what kind of project this is:
   - `package.json` → Node.js
   - `pyproject.toml` / `requirements.txt` / `setup.py` → Python
   - `Cargo.toml` → Rust
   - `go.mod` → Go
   - `Gemfile` → Ruby
   - `docker-compose.yml` / `Dockerfile` → Docker
   - Multiple indicators → Monorepo or polyglot project

2. **Run diagnostics** in this order (skip checks that do not apply):

   ### Runtime & tooling
   - Check if the required runtime is installed and what version:
     - `node --version`, `npm --version` or `yarn --version` or `pnpm --version`
     - `python3 --version`, `pip --version`
     - `docker --version`, `docker compose version`
   - Compare against version requirements in the project config (e.g., `engines` in package.json, `python_requires` in pyproject.toml)
   - Flag version mismatches clearly: "Project requires Node >= 18, you have 16.14.0"

   ### Dependencies
   - Check if dependencies are installed:
     - Node: Does `node_modules/` exist? Run `npm ls --depth=0 2>&1 | grep ERR` to check for missing or conflicting packages
     - Python: Check if the virtualenv exists and is activated. Run `pip check` for dependency conflicts
   - If dependencies are missing, suggest the install command
   - Check for lockfile mismatches (package-lock.json vs yarn.lock vs pnpm-lock.yaml — flag if multiple exist)

   ### Environment variables
   - Check for `.env.example`, `.env.sample`, or `.env.template`
   - Check if `.env` exists
   - If `.env.example` exists but `.env` does not: flag this as a likely problem and show the missing variables
   - If both exist: diff them to find variables defined in the example but missing from `.env`
   - Check for empty values in `.env` that look like placeholders (e.g., `DATABASE_URL=your_database_url_here`)
   - Never print the actual values of secrets. Only report which keys are present, missing, or empty.

   ### Database & services
   - If the project uses a database (check config files, env vars like DATABASE_URL, POSTGRES_*, MONGO_*):
     - Check if the database service is running (`pg_isready`, `docker ps | grep postgres`, etc.)
     - Check if the connection string looks valid (correct format, not a placeholder)
   - If `docker-compose.yml` exists: check if containers are running with `docker compose ps`
   - Check for Redis, Elasticsearch, or other services referenced in config

   ### Ports
   - Identify what port the project wants to use (from config, env vars, or common defaults)
   - Check if that port is already in use: `lsof -i :<port>` or `ss -tlnp | grep <port>`
   - If occupied, identify what process is using it and suggest killing it or using a different port

   ### Build artifacts
   - Check if a build step is needed but has not been run (e.g., `dist/` or `build/` directory missing when scripts reference it)
   - Check for TypeScript compilation issues: `npx tsc --noEmit 2>&1 | head -20`

3. **Report findings**:

```
## Environment Health Check

### ✅ Passing
- Node.js 20.11.0 (required: >= 18) 
- Dependencies installed (347 packages, 0 issues)
- Port 3000 is available

### ❌ Issues found

**Missing .env file**
You have a `.env.example` but no `.env` file. Copy it and fill in your values:
\`\`\`bash
cp .env.example .env
\`\`\`
These variables need real values:
- `DATABASE_URL` (currently empty)
- `STRIPE_SECRET_KEY` (currently a placeholder)

**PostgreSQL is not running**
The project expects PostgreSQL on localhost:5432 but no service is listening.
\`\`\`bash
# If using Docker:
docker compose up -d postgres

# If using Homebrew (macOS):
brew services start postgresql@16

# If using system service (Linux):
sudo systemctl start postgresql
\`\`\`

### 💡 Suggestions
- You have both `package-lock.json` and `yarn.lock`. Pick one package
  manager and delete the other lockfile to avoid conflicts.
```

4. **Offer to fix**: For each issue found, offer to run the fix command if it is safe and non-destructive (installing dependencies, copying env files, starting services). Never offer to delete data or run destructive commands without explicit confirmation.

## Rules

- Always check environment variables first. Missing env vars are the #1 cause of "it works on my machine" problems.
- Never print secret values. Report keys only, never values. Say "STRIPE_SECRET_KEY is empty" not "STRIPE_SECRET_KEY=sk_test_abc123..."
- If everything passes, say so clearly: "Everything looks good. The project should be ready to run." Then suggest the start command.
- If the project has a README with setup instructions, read it and verify each step has been completed.
- Run checks in dependency order. There is no point checking if the database connection works if the database service is not running.
- For each issue, always provide the exact command to fix it. Do not just describe the problem.
- If you are unsure about the fix, say so. "This might be the issue, but I am not certain" is better than a confident wrong answer.
- Limit the diagnostic to 60 seconds of work. If the project has deep issues, report what you found and suggest the user focus on the most critical issue first.


---