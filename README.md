# OpenClaw Skills

This repository contains OpenClaw agent skills for automating openEuler community workflows.

## Skills

### openeuler-auto-push

Automate patch submission to openEuler community repositories.

**Features:**
- Clone repositories with shallow clone support for large repos (e.g., kernel)
- Sync patches between branches
- Push changes to personal forks
- Create pull requests via API
- Monitor CI pipeline status

**Usage:**

```bash
# Sync patch to another branch (normal repo)
bash scripts/sync_patch.sh \
    ethtool \
    openEuler-24.03-LTS-SP3 \
    openEuler-24.03-LTS-Next

# Large repository (e.g., kernel) - use sparse checkout
bash scripts/sync_patch.sh \
    kernel \
    OLK-6.6 \
    OLK-6.6 \
    "" \
    "drivers/ub/ubase/"

# Create PR
python3 scripts/create_pr.py \
    --token YOUR_TOKEN \
    --repo ethtool \
    --source-branch openEuler-24.03-LTS-Next \
    --target-branch openEuler-24.03-LTS-Next \
    --title "your title" \
    --description "your description"

# Monitor CI
python3 scripts/monitor_ci.py \
    --token YOUR_TOKEN \
    --project-id 7687244 \
    --mr-iid 61 \
    --watch
```

**Installation:**

```bash
# Copy to OpenClaw skills directory
cp openeuler-auto-push.skill ~/.openclaw/skills/

# Or extract and use directly
cd ~/.openclaw/workspace
unzip openeuler-auto-push.skill -d openeuler-auto-push
```

## References

- [openEuler CI Guide](references/openeuler-ci-guide.md)
- [AtomGit API Reference](references/api_reference.md)

## License

MIT License
