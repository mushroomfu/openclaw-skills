# openEuler Auto Push

Automate the complete workflow for contributing patches to openEuler kernel.

## What it does

This skill automates:
1. **Parse patches** - Read and extract metadata from patch files
2. **Create issue** - Generate issue content and open AtomGit browser page
3. **Update patches** - Replace bugzilla URLs with new issue number
4. **Push code** - Apply patches to local kernel and push to personal fork
5. **Create PR** - Open PR creation page on AtomGit

## Installation

```bash
# Clone to OpenClaw skills directory
git clone https://github.com/mufengyan/openeuler-auto-push.git \
  ~/.openclaw/skills/openeuler-auto-push
```

## Configuration

Edit `~/.openclaw/skills/openeuler-auto-push/config.json`:

```json
{
  "local_kernel_path": "/path/to/your/kernel",
  "patch_dir": "/path/to/patches"
}
```

## Usage

### From OpenClaw Agent

```javascript
const autoPush = skills.openeulerAutoPush;

await autoPush.process({
  patchPath: "/path/to/patches",
  issueTitle: "[bugfix] net: unic: Stability fixes",
  issueDescription: "Optional custom description"
});
```

### CLI Usage

```bash
openclaw skill run openeuler-auto-push \
  --patchPath /path/to/patches \
  --issueTitle "Your issue title"
```

## Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. PARSE PATCHES                                       │
│     - Read all .patch files                             │
│     - Extract subject, author, category, CVE, etc       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. GENERATE ISSUE CONTENT                              │
│     - Combine patch descriptions                        │
│     - Format as markdown                                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. CREATE ISSUE (Browser)                              │
│     - Open AtomGit issue creation page                  │
│     - Fill title and description                        │
│     - User confirms creation                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  4. UPDATE PATCHES                                      │
│     - Replace bugzilla URLs                             │
│     - Update all patch files                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. PUSH TO FORK                                        │
│     - Stash local changes                               │
│     - Fetch upstream                                    │
│     - Apply patches with git am                         │
│     - Force push to origin                              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  6. CREATE PR (Browser)                                 │
│     - Open PR creation page                             │
│     - Pre-fill title and description                    │
│     - User completes PR creation                        │
└─────────────────────────────────────────────────────────┘
```

## Example

### Input: Patch Files
```
patches/
├── 0001-net-unic-Delete-the-elr-reset-process.patch
├── 0002-net-unic-Provide-the-DFX-capability.patch
└── 0003-net-unic-Resolve-network-unavailability.patch
```

### Output: Issue #8683
**Title**: `[bugfix] net: unic: Multiple stability fixes for tx timeout, DFX capability and concurrent activation/reset`

**Description**:
```markdown
## Problem Summary

This issue tracks 3 related bugfixes:

### Issue 1: tx timeout elr reset causes system instability
- **Category**: bugfix
- **CVE**: NA
- **Author**: Haiqing Fang <fanghaiqing@huawei.com>

The elr reset process after the tx timeout is deleted...

### Issue 2: Missing DFX capability for MNG table query
...

### Issue 3: Concurrent activation/reset causes network unavailability
...

## Patches
- [PATCH 1/3] net: unic: Delete the elr reset process after the tx timeout
- [PATCH 2/3] net: unic: Provide the DFX capability for querying MNG table
- [PATCH 3/3] net: unic: Resolve network unavailability caused by concurrent activation and reset
```

### Updated Patches
All 3 patch files updated with:
```
bugzilla: https://atomgit.com/openeuler/kernel/issues/8683
```

## File Structure

```
openeuler-auto-push/
├── skill.json          # Skill manifest
├── SKILL.md            # This documentation
└── src/
    └── index.js        # Main implementation
```

## License

MIT
