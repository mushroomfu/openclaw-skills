#!/bin/bash
# github-setup.sh - 快速设置 GitHub 仓库

# 请在执行前确保：
# 1. 已在 GitHub 创建 openclaw-skills 仓库
# 2. 替换下面命令中的 TOKEN

cd ~/.openclaw/skills

# 配置远程仓库（使用 Token）
git remote remove origin 2>/dev/null
git remote add origin https://mushromfu:TOKEN@github.com/mushromfu/openclaw-skills.git

# 推送
echo "正在推送到 GitHub..."
git push -u origin main

echo "完成！"
