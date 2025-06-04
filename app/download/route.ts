import { NextResponse } from 'next/server'

export async function GET() {
    const script = `#!/bin/bash

set -e

echo "📦 Installing judge..."

INSTALL_PATH="$HOME/.local/bin"
SCRIPT_URL="https://raw.githubusercontent.com/suceavahacks/codejudger/main/cmd.sh"
SCRIPT_NAME="hackacode"

mkdir -p "$INSTALL_PATH"
curl -sSL "$SCRIPT_URL" -o "$INSTALL_PATH/$SCRIPT_NAME"
chmod +x "$INSTALL_PATH/$SCRIPT_NAME"

if ! echo "$PATH" | grep -q "$INSTALL_PATH"; then
    SHELL_RC="$HOME/.bashrc"
    [[ $SHELL == *zsh ]] && SHELL_RC="$HOME/.zshrc"

    echo "export PATH=\\"$INSTALL_PATH:\\$PATH\\"" >> "$SHELL_RC"
    echo "✅ Added $INSTALL_PATH to PATH in $SHELL_RC"
    echo "👉 Run 'source $SHELL_RC' or restart your terminal to use 'hackacode'"
fi

echo "🎉 Installed successfully. Try running: hackacode --help"
`

    const buffer = Buffer.from(script, 'utf-8')

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/x-sh',
            'Content-Disposition': 'attachment; filename="install.sh"',
        },
    })
}
