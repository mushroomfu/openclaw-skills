#!/bin/bash
# push-to-github.sh - Push skills to GitHub

# Instructions:
# 1. Create a GitHub repository at https://github.com/new
#    - Repository name: openclaw-skills
#    - Public or Private (your choice)
#
# 2. Get your GitHub Personal Access Token:
#    - Go to https://github.com/settings/tokens
#    - Generate new token with 'repo' scope
#
# 3. Run this script with your token:
#    GITHUB_TOKEN=ghp_xxx ./push-to-github.sh

cd ~/.openclaw/skills

# Add remote (replace USERNAME with your GitHub username)
# git remote add origin https://USERNAME:$GITHUB_TOKEN@github.com/USERNAME/openclaw-skills.git
# Or use SSH:
# git remote add origin git@github.com:USERNAME/openclaw-skills.git

echo "To push to GitHub, run:"
echo ""
echo "1. Add remote:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/openclaw-skills.git"
echo ""
echo "2. Push:"
echo "   git push -u origin main"
echo ""
echo "Current status:"
git log --oneline -1
git remote -v
