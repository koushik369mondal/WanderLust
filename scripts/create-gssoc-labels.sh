#!/bin/bash

# Script to create GSSoC'25 labels for the repository
# Run this script if you need to manually create the labels

# Colors for the labels
GSSOC_COLOR="ff6b35"   # Orange color for GSSoC'25
LEVEL1_COLOR="28a745"  # Green color for Level1 (Easy)
LEVEL2_COLOR="0366d6"  # Blue color for Level2 (Intermediate)
LEVEL3_COLOR="d73a49"  # Red color for Level3 (Hard)

echo "🏷️ Creating GSSoC'25 labels for WanderLust repository..."

# Create GSSoC'25 label
gh label create "GSSoC'25" \
  --description "Part of GirlScript Summer of Code 2025" \
  --color "$GSSOC_COLOR" \
  --force

# Create Level1 label (Easy)
gh label create "Level1" \
  --description "Easy level task - good for beginners and simple changes" \
  --color "$LEVEL1_COLOR" \
  --force

# Create Level2 label (Intermediate)
gh label create "Level2" \
  --description "Intermediate level task - suitable for contributors with some experience" \
  --color "$LEVEL2_COLOR" \
  --force

# Create Level3 label (Hard)
gh label create "Level3" \
  --description "Advanced level task - requires significant experience and affects core functionality" \
  --color "$LEVEL3_COLOR" \
  --force

# Create additional GSSoC'25 related labels
gh label create "gssoc-participant" \
  --description "Contributor participating in GSSoC'25" \
  --color "28a745" \
  --force

gh label create "gssoc-mentor" \
  --description "Mentor for GSSoC'25 program" \
  --color "6f42c1" \
  --force

gh label create "good-first-issue" \
  --description "Good for newcomers and first-time contributors" \
  --color "7057ff" \
  --force

gh label create "help-wanted" \
  --description "Extra attention is needed" \
  --color "008672" \
  --force

echo "✅ GSSoC'25 labels created successfully!"
echo "📋 Created labels:"
echo "   🎯 GSSoC'25 - Main program label"
echo "   � Level1 - Easy difficulty level (docs, minor fixes)"
echo "   🔵 Level2 - Intermediate difficulty level (features, controllers)"
echo "   🔴 Level3 - Advanced difficulty level (core, database, architecture)"
echo "   👋 good-first-issue - For beginners"
echo "   🤝 help-wanted - Needs assistance"
echo "   🎓 gssoc-participant - For participants"
echo "   👨‍🏫 gssoc-mentor - For mentors"

echo ""
echo "🚀 The gssoc-labeler.yml workflow will automatically apply GSSoC'25 and Level2 labels to all new issues and PRs!"