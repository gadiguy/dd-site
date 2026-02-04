#!/bin/bash

# Block commands with global effects or that can't be undone with git

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

# Project directory (where this hook lives)
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Patterns for global/destructive operations
BLOCKED_PATTERNS=(
    # Global npm/package operations
    "npm install -g"
    "npm i -g"
    "npm uninstall -g"
    "yarn global"
    "pnpm add -g"

    # System-wide changes
    "sudo "
    "brew install"
    "brew uninstall"
    "apt install"
    "apt-get install"
    "apt remove"
    "apt-get remove"

    # Destructive git operations (can't be undone)
    "git push --force"
    "git push -f"
    "git reset --hard"
    "git clean -f"
    "git checkout ."
    "git restore ."
    "git stash drop"
    "git stash clear"
    "git branch -D"
    "git rebase"

    # Dangerous file operations
    "rm -rf /"
    "rm -rf ~"
    "rm -rf \$HOME"
    "chmod -R"
    "chown -R"

    # Config changes
    "git config --global"
    "npm config set"
)

# Check for blocked patterns
for pattern in "${BLOCKED_PATTERNS[@]}"; do
    if echo "$COMMAND" | grep -qF "$pattern"; then
        echo "Blocked: '$pattern' has global effects or can't be undone with git" >&2
        exit 2
    fi
done

# Block home directory references (~ or $HOME)
if echo "$COMMAND" | grep -qE '(^|[[:space:]])~(/|[[:space:]]|$|>)'; then
    echo "Blocked: home directory reference (~) is outside project directory" >&2
    exit 2
fi

if echo "$COMMAND" | grep -qE '\$HOME([^A-Za-z_]|$)'; then
    echo "Blocked: \$HOME reference is outside project directory" >&2
    exit 2
fi

# Check if command operates outside project directory
# Look for absolute paths that aren't in the project
if echo "$COMMAND" | grep -qE '(^|[[:space:]])/[^[:space:]]+'; then
    # Extract paths from command
    PATHS=$(echo "$COMMAND" | grep -oE '(^|[[:space:]])/[^[:space:]]+' | tr -d ' ')
    for path in $PATHS; do
        # Resolve the path
        RESOLVED=$(realpath -m "$path" 2>/dev/null || echo "$path")
        # Check if it's outside project
        if [[ ! "$RESOLVED" =~ ^"$PROJECT_DIR" ]] && [[ ! "$RESOLVED" =~ ^/dev/ ]] && [[ ! "$RESOLVED" =~ ^/tmp/ ]]; then
            echo "Blocked: path '$path' is outside project directory" >&2
            exit 2
        fi
    done
fi

# Check for cd to outside project
if echo "$COMMAND" | grep -qE '^cd[[:space:]]+'; then
    TARGET=$(echo "$COMMAND" | sed 's/^cd[[:space:]]*//' | sed 's/[[:space:]].*//')
    if [[ "$TARGET" =~ ^/ ]]; then
        RESOLVED=$(realpath -m "$TARGET" 2>/dev/null || echo "$TARGET")
        if [[ ! "$RESOLVED" =~ ^"$PROJECT_DIR" ]]; then
            echo "Blocked: cd to '$TARGET' is outside project directory" >&2
            exit 2
        fi
    elif [[ "$TARGET" == ".." ]] || [[ "$TARGET" =~ ^\.\./  ]]; then
        RESOLVED=$(realpath -m "$CWD/$TARGET" 2>/dev/null)
        if [[ ! "$RESOLVED" =~ ^"$PROJECT_DIR" ]]; then
            echo "Blocked: cd to '$TARGET' would leave project directory" >&2
            exit 2
        fi
    fi
fi

# Allow the command
exit 0
