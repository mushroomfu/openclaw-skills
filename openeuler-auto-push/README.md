# openEuler Auto Push

🚀 **Automate your openEuler kernel patch workflow**

This OpenClaw skill automates the complete workflow of contributing patches to the openEuler kernel repository, from issue creation to PR submission.

## Features

✅ **Parse patch files** - Automatically extract metadata from patch files  
✅ **Create issues** - Generate and create AtomGit issues with proper formatting  
✅ **Update patches** - Replace bugzilla URLs with new issue numbers  
✅ **Push code** - Apply patches and push to your personal fork  
✅ **Create PRs** - Open PR creation page with pre-filled details  

## Quick Start

### Installation

```bash
git clone https://github.com/mufengyan/openeuler-auto-push.git \
  ~/.openclaw/skills/openeuler-auto-push
```

### Configuration

```json
{
  "local_kernel_path": "/path/to/your/kernel",
  "patch_dir": "/path/to/patches"
}
```

### Usage

```javascript
const autoPush = skills.openeulerAutoPush;

await autoPush.process({
  patchPath: "/path/to/patches",
  issueTitle: "[bugfix] net: unic: Stability fixes"
});
```

## Workflow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Parse Patches│───▶│ Create Issue │───▶│Update Patches│
└──────────────┘    └──────────────┘    └──────────────┘
                                                │
                                                ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Complete   │◄───│  Create PR   │◄───│  Push Fork   │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Requirements

- OpenClaw with browser automation enabled
- Local clone of openEuler kernel repository
- Personal fork of openEuler/kernel on AtomGit
- Git configured with proper remotes

## Documentation

See [SKILL.md](./SKILL.md) for detailed documentation.

## License

MIT License - see [LICENSE](./LICENSE) for details.
