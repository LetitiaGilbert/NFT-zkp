# Installation Guide

Before running the frontend, you need Node.js and npm installed.

## Install Node.js

### Windows (Recommended: Use a package manager)
**Option 1: Direct Download**
- Visit https://nodejs.org/
- Download LTS version (includes npm)
- Run installer, follow prompts
- Verify: Open Command Prompt and run `node --version`

**Option 2: Using Chocolatey**
```powershell
choco install nodejs
```

**Option 3: Using Windows Package Manager**
```powershell
winget install OpenJS.NodeJS.LTS
```

### macOS
**Using Homebrew:**
```bash
brew install node
```

**Or direct download:** https://nodejs.org/

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## Verify Installation

```bash
node --version  # Should show v18+ or v20+
npm --version   # Should show 9+ or 10+
```

---

## Getting Started (After Node.js Installation)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will open at http://localhost:3000

---

## Troubleshooting

### "npm: command not found"
- Node.js not installed. Follow installation steps above.
- Try closing and reopening terminal after install.

### "npm ERR! code EACCES" (on macOS/Linux)
Fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Slow npm install?
Use a faster package manager (optional):
```bash
npm install -g pnpm
pnpm install   # Much faster
pnpm run dev
```

---

Need help? Check the README.md in the frontend folder.
