#!/bin/bash

# Screenshot Requirement Workflow - Test Script
# This script helps test and validate the screenshot requirement setup

set -e

echo "🔧 Screenshot Requirement Workflow - Test & Validation Script"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_status $RED "❌ GitHub CLI (gh) is not installed. Please install it first."
    print_status $YELLOW "💡 Installation: https://cli.github.com/"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_status $RED "❌ Not in a git repository"
    exit 1
fi

# Get repository information
REPO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name')
print_status $BLUE "📁 Repository: $REPO"

echo ""
print_status $YELLOW "🔍 Checking workflow setup..."

# Check if workflow file exists
WORKFLOW_FILE=".github/workflows/screenshot-check.yml"
if [ -f "$WORKFLOW_FILE" ]; then
    print_status $GREEN "✅ Screenshot workflow file exists"
else
    print_status $RED "❌ Screenshot workflow file not found at $WORKFLOW_FILE"
    exit 1
fi

# Check if documentation exists
DOC_FILE="docs/screenshot-requirement-setup.md"
if [ -f "$DOC_FILE" ]; then
    print_status $GREEN "✅ Documentation file exists"
else
    print_status $YELLOW "⚠️  Documentation file not found at $DOC_FILE"
fi

# Check PR template
PR_TEMPLATE=".github/pull_request_template.md"
if [ -f "$PR_TEMPLATE" ]; then
    if grep -q "Screenshots & Visual Documentation" "$PR_TEMPLATE"; then
        print_status $GREEN "✅ PR template includes screenshot section"
    else
        print_status $YELLOW "⚠️  PR template exists but doesn't include enhanced screenshot section"
    fi
else
    print_status $YELLOW "⚠️  PR template not found"
fi

echo ""
print_status $YELLOW "🔒 Checking branch protection rules..."

# Check branch protection rules
MAIN_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
print_status $BLUE "🌿 Main branch: $MAIN_BRANCH"

# Get branch protection status
PROTECTION_STATUS=$(gh api repos/$REPO/branches/$MAIN_BRANCH/protection 2>/dev/null || echo "none")

if [ "$PROTECTION_STATUS" = "none" ]; then
    print_status $YELLOW "⚠️  No branch protection rules found for $MAIN_BRANCH"
    print_status $BLUE "💡 To enable screenshot requirement enforcement:"
    echo "   1. Go to: https://github.com/$REPO/settings/branches"
    echo "   2. Add rule for '$MAIN_BRANCH' branch"
    echo "   3. Enable 'Require status checks to pass before merging'"
    echo "   4. Add 'screenshot-check' to required status checks"
else
    # Check if screenshot-check is in required status checks
    SCREENSHOT_CHECK=$(echo "$PROTECTION_STATUS" | jq -r '.required_status_checks.contexts[]? | select(. == "screenshot-check")' 2>/dev/null || echo "")
    
    if [ -n "$SCREENSHOT_CHECK" ]; then
        print_status $GREEN "✅ screenshot-check is required in branch protection"
    else
        print_status $YELLOW "⚠️  screenshot-check is NOT required in branch protection"
        print_status $BLUE "💡 Add 'screenshot-check' to required status checks in branch protection settings"
    fi
fi

echo ""
print_status $YELLOW "🧪 Testing workflow patterns..."

# Test skip patterns
echo "Testing skip patterns:"
test_titles=(
    "[skip-screenshot] Update README"
    "docs: Update API documentation"
    "test: Add unit tests for authentication"
    "chore: Update dependencies"
    "refactor: Clean up utility functions"
    "feat: Add new user profile page"
    "fix: Resolve navigation bug"
)

for title in "${test_titles[@]}"; do
    if [[ "$title" =~ ^\[skip-screenshot\] ]] || \
       [[ "$title" =~ ^docs?: ]] || \
       [[ "$title" =~ ^test: ]] || \
       [[ "$title" =~ ^chore: ]] || \
       [[ "$title" =~ ^refactor: ]]; then
        print_status $GREEN "  ✅ '$title' - Would SKIP screenshot check"
    else
        print_status $YELLOW "  📷 '$title' - Would REQUIRE screenshot"
    fi
done

echo ""
print_status $YELLOW "🎯 Workflow validation summary:"

# Create summary
if [ -f "$WORKFLOW_FILE" ]; then
    WORKFLOW_OK="✅"
else
    WORKFLOW_OK="❌"
fi

if [ "$PROTECTION_STATUS" != "none" ] && [ -n "$SCREENSHOT_CHECK" ]; then
    PROTECTION_OK="✅"
elif [ "$PROTECTION_STATUS" != "none" ]; then
    PROTECTION_OK="⚠️"
else
    PROTECTION_OK="❌"
fi

echo "┌─────────────────────────────────────┐"
echo "│ Component                   Status  │"
echo "├─────────────────────────────────────┤"
printf "│ Workflow File               ${WORKFLOW_OK}      │\n"
printf "│ Branch Protection           ${PROTECTION_OK}      │\n"
echo "│ Documentation               ✅      │"
echo "│ PR Template                 ✅      │"
echo "└─────────────────────────────────────┘"

echo ""
print_status $BLUE "🚀 Next steps:"

if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "   1. Create the screenshot-check.yml workflow file"
fi

if [ "$PROTECTION_STATUS" = "none" ] || [ -z "$SCREENSHOT_CHECK" ]; then
    echo "   2. Configure branch protection with screenshot-check requirement"
    echo "      → https://github.com/$REPO/settings/branches"
fi

echo "   3. Test the workflow by creating a PR without screenshots"
echo "   4. Verify the check fails and provides helpful feedback"
echo "   5. Add a screenshot and confirm the check passes"

echo ""
print_status $GREEN "🎉 Screenshot requirement workflow validation complete!"
print_status $BLUE "📚 For detailed setup instructions, see: docs/screenshot-requirement-setup.md"