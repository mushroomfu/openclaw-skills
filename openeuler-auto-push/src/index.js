const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * openEuler Auto Push Skill
 * 
 * Workflow:
 * 1. Parse patch files
 * 2. Create issue on AtomGit (via browser)
 * 3. Update patch bugzilla fields
 * 4. Push to personal fork
 * 5. Create PR (open browser page)
 */

class OpenEulerAutoPush {
  constructor(config = {}) {
    this.config = {
      kernelPath: config.local_kernel_path || '/Users/mufengyan/Documents/openeuler_work/kernel_atom/kernel',
      patchDir: config.patch_dir || '/Users/mufengyan/Documents/openeuler_work/ubus_patches_2',
      ...config
    };
  }

  /**
   * Main entry point
   */
  async process(options) {
    const { patchPath, issueTitle, issueDescription } = options;
    
    console.log('🚀 Starting openEuler auto-push workflow...\n');
    
    // Step 1: Parse patches
    console.log('📄 Step 1: Parsing patch files...');
    const patches = this.parsePatches(patchPath);
    console.log(`   Found ${patches.length} patch(es)`);
    
    // Step 2: Generate issue content
    console.log('\n📝 Step 2: Generating issue content...');
    const generatedDescription = issueDescription || this.generateIssueDescription(patches);
    
    // Step 3: Create issue via browser
    console.log('\n🔗 Step 3: Opening AtomGit to create issue...');
    console.log('   Title:', issueTitle);
    const issueUrl = await this.createIssue(issueTitle, generatedDescription);
    
    // Step 4: Update patches with issue URL
    console.log('\n✏️  Step 4: Updating patch files with issue URL...');
    const updatedPatches = this.updatePatches(patchPath, issueUrl);
    console.log(`   Updated ${updatedPatches.length} patch file(s)`);
    
    // Step 5: Git operations
    console.log('\n📦 Step 5: Pushing to personal fork...');
    this.pushToFork(patchPath);
    
    // Step 6: Open PR page
    console.log('\n📤 Step 6: Opening PR creation page...');
    await this.openPRCreationPage(issueTitle, issueUrl);
    
    console.log('\n✅ Workflow complete!');
    console.log('\nSummary:');
    console.log(`  - Issue URL: ${issueUrl}`);
    console.log(`  - Patches updated: ${updatedPatches.join(', ')}`);
    console.log(`  - Code pushed to: mufengyan/kernel:OLK-6.6`);
    
    return {
      issueUrl,
      updatedPatches,
      patches: patches.map(p => p.subject)
    };
  }

  /**
   * Parse patch files from directory
   */
  parsePatches(patchPath) {
    const patches = [];
    const files = fs.readdirSync(patchPath)
      .filter(f => f.endsWith('.patch'))
      .sort();
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(patchPath, file), 'utf-8');
      const patch = this.parsePatchContent(content, file);
      patches.push(patch);
    }
    
    return patches;
  }

  parsePatchContent(content, filename) {
    const lines = content.split('\n');
    const patch = {
      filename,
      content,
      subject: '',
      from: '',
      bugzilla: '',
      category: '',
      cve: '',
      description: []
    };
    
    let inDescription = false;
    
    for (const line of lines) {
      if (line.startsWith('Subject:')) {
        patch.subject = line.replace(/^Subject:\s*\[PATCH[^\]]*\]\s*/, '').trim();
      }
      if (line.startsWith('From:')) {
        patch.from = line.replace(/^From:\s*/, '').trim();
      }
      if (line.startsWith('bugzilla:')) {
        patch.bugzilla = line.replace(/^bugzilla:\s*/, '').trim();
      }
      if (line.startsWith('category:')) {
        patch.category = line.replace(/^category:\s*/, '').trim();
      }
      if (line.startsWith('CVE:')) {
        patch.cve = line.replace(/^CVE:\s*/, '').trim();
      }
      if (line.match(/^[-]{10,}$/)) {
        inDescription = true;
        continue;
      }
      if (inDescription && line.startsWith('---')) {
        inDescription = false;
        continue;
      }
      if (inDescription && line.trim()) {
        patch.description.push(line);
      }
    }
    
    patch.description = patch.description.join('\n');
    return patch;
  }

  /**
   * Generate issue description from patches
   */
  generateIssueDescription(patches) {
    let desc = '## Problem Summary\n\n';
    desc += `This issue tracks ${patches.length} related bugfixes:\n\n`;
    
    patches.forEach((patch, index) => {
      desc += `### Issue ${index + 1}: ${patch.subject}\n`;
      desc += `- **Category**: ${patch.category || 'N/A'}\n`;
      desc += `- **CVE**: ${patch.cve || 'NA'}\n`;
      desc += `- **Author**: ${patch.from}\n\n`;
      if (patch.description) {
        desc += `${patch.description}\n\n`;
      }
    });
    
    desc += '## Patches\n';
    patches.forEach((patch, index) => {
      desc += `- [PATCH ${index + 1}/${patches.length}] ${patch.subject}\n`;
    });
    
    return desc;
  }

  /**
   * Create issue on AtomGit using browser
   */
  async createIssue(title, description) {
    // This will be handled by the agent with browser tools
    // Return the expected issue URL pattern
    const timestamp = Date.now();
    console.log('   (Browser automation needed to complete issue creation)');
    console.log('   After creation, note the issue number and update patches');
    
    // Placeholder - actual issue URL will be provided by user or browser
    return `https://atomgit.com/openeuler/kernel/issues/NEW`;
  }

  /**
   * Update patch files with new issue URL
   */
  updatePatches(patchPath, issueUrl) {
    const files = fs.readdirSync(patchPath).filter(f => f.endsWith('.patch'));
    const updated = [];
    
    for (const file of files) {
      const filepath = path.join(patchPath, file);
      let content = fs.readFileSync(filepath, 'utf-8');
      
      // Extract issue number from URL
      const issueMatch = issueUrl.match(/\/issues\/(\d+)$/);
      if (issueMatch) {
        const newBugzilla = `https://atomgit.com/openeuler/kernel/issues/${issueMatch[1]}`;
        const original = content;
        content = content.replace(
          /bugzilla:\s*https:\/\/atomgit\.com\/openeuler\/kernel\/issues\/\d+/,
          `bugzilla: ${newBugzilla}`
        );
        
        if (content !== original) {
          fs.writeFileSync(filepath, content);
          updated.push(file);
        }
      }
    }
    
    return updated;
  }

  /**
   * Push patches to personal fork
   */
  pushToFork(patchPath) {
    const kernelPath = this.config.kernelPath;
    
    // Stash changes
    try { execSync('git stash', { cwd: kernelPath }); } catch (e) {}
    
    // Add remote if not exists
    try {
      execSync('git remote add upstream https://atomgit.com/openeuler/kernel.git', { cwd: kernelPath });
    } catch (e) {}
    
    // Fetch upstream
    execSync('git fetch upstream OLK-6.6', { cwd: kernelPath });
    
    // Reset and clean
    execSync('git reset --hard HEAD', { cwd: kernelPath });
    execSync('git clean -fd', { cwd: kernelPath, stdio: 'ignore' });
    
    // Apply patches
    const patchFiles = fs.readdirSync(patchPath)
      .filter(f => f.endsWith('.patch'))
      .sort()
      .map(f => path.join(patchPath, f));
    
    if (patchFiles.length > 0) {
      execSync(`git am ${patchFiles.join(' ')}`, { cwd: kernelPath });
    }
    
    // Push to fork
    execSync('git push --force origin OLK-6.6', { cwd: kernelPath });
    
    return true;
  }

  /**
   * Open PR creation page
   */
  async openPRCreationPage(title, issueUrl) {
    const prUrl = 'https://atomgit.com/openeuler/kernel/pulls/new';
    console.log(`   PR URL: ${prUrl}`);
    console.log('   (Browser will open for manual completion)');
    return prUrl;
  }
}

module.exports = OpenEulerAutoPush;
