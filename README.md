# OpenClaw Daily Backup

**Daily backup and restore for critical OpenClaw workspace files.**

`soul-backup-skill` is the lighter backup repo focused on protecting the core files that define an OpenClaw agent’s behavior and memory scaffolding.

**Best for:** simple daily backups, rollback, and protecting SOUL-style workspace files.

---

# Why teams use it

- Back up the files that make an agent feel like itself
- Recover quickly from accidental edits or deletion
- Keep timestamped snapshots instead of relying on memory
- Validate integrity before trusting a restore
- Maintain a simpler backup flow than the fuller recovery stack

---

# What it protects

- `SOUL.md`
- `USER.md`
- `AGENTS.md`
- `IDENTITY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md`

---

# Quick start

Install:

```bash
npm install
```

Create a backup:

```bash
node scripts/backup.mjs
```

List backups:

```bash
node scripts/list.mjs
```

Restore latest backup:

```bash
node scripts/restore.mjs
```

Dry-run restore:

```bash
node scripts/restore.mjs --dry-run
```

Validate backups:

```bash
node scripts/validate.mjs
```

---

# Core features

- timestamped backups
- named backups
- rollback after bad restore
- file-level restore
- checksum validation
- zero external runtime dependencies

---

# Typical use cases

- “Back up this OpenClaw workspace every day”
- “Restore the last known good SOUL state”
- “Roll back a bad prompt / config / identity change”
- “Validate that backups are restorable”

---

# Files

- `SKILL.md` — agent-facing routing and usage guidance
- `RUNBOOK.md` — operational recovery scenarios
- `FEATURE_DEFINITION.md` — positioning and roadmap
- `scripts/backup.mjs` — create a backup
- `scripts/restore.mjs` — restore a backup
- `scripts/list.mjs` — list available backups
- `scripts/validate.mjs` — verify integrity

---

# Important limits

- This repo is backup-focused, not a full disaster-recovery system
- Backups are only valuable if restore paths are tested
- For richer off-machine backup and config handling, use the more complete `openclaw-backup-restore` stack

---

# Bottom line

If you want a simpler daily backup layer for the files that define an OpenClaw agent, this repo gives you the lightweight version.
