# ⚡ QUICK INSTALL REFERENCE

Copy-paste these exact commands. No thinking required.

---

## 🔧 STEP 1: INSTALL NODE.JS (One-time, 5 min)

**Windows:**
1. Go to https://nodejs.org/
2. Click "Download LTS"
3. Run installer (default options)
4. Restart computer
5. Open Command Prompt and verify:
```
node --version
npm --version
```

**macOS:**
```bash
brew install node
# Verify:
node --version && npm --version
```

**Linux:**
```bash
sudo apt update
sudo apt install nodejs npm
# Verify:
node --version && npm --version
```

---

## 📦 STEP 2: INSTALL DEPENDENCIES (15 min total)

**All three commands take 2-3 minutes each. Run them sequentially.**

### Terminal 1: Frontend
```bash
cd frontend
npm install
# Wait for it to finish (shows "added X packages")
```

### Terminal 2: Smart Contracts
```bash
cd contracts
npm install
# Wait for it to finish
```

### Terminal 3: ZKP Circuit
```bash
cd zkp
npm install
# Wait for it to finish
```

---

## ✅ VERIFY INSTALLATION (2 min)

After all three complete, verify each folder:

### Check Frontend
```bash
cd frontend
npm list react ethers snarkjs vite
# Should show versions without errors
npm run dev
# Should start dev server (opens http://localhost:3000)
# Press Ctrl+C to stop
```

### Check Contracts
```bash
cd contracts
npx hardhat compile
# Should say "0 errors"
npx hardhat test
# Should pass tests
```

### Check ZKP
```bash
cd zkp
node prove.js
# Should show "✓ Proof generated"
```

---

## 🎯 WHAT GETS INSTALLED

```
frontend/node_modules/          ~500 MB
  ├── react
  ├── ethers
  ├── snarkjs
  └── vite

contracts/node_modules/         ~600 MB
  ├── hardhat
  ├── ethers
  └── @nomiclabs plugins

zkp/node_modules/               ~100 MB
  └── snarkjs

TOTAL: ~1.2 GB (needs 2GB free disk space)
```

---

## 🚨 IF SOMETHING FAILS

### "npm: command not found"
→ Node.js not installed. Follow Step 1 again.

### "npm ERR! code ERESOLVE"
```bash
npm install --legacy-peer-deps
```

### "Permission denied" (Mac/Linux)
```bash
sudo npm install
```

### "npm is slow / hanging"
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "npm install works but npm run dev fails"
```bash
cd frontend
rm -rf node_modules
npm cache clean --force
npm install
npm run dev
```

---

## 📝 EXACT FOLDER STRUCTURE

Make sure you're in the right place:

```
C:\Users\laksh\blockchain_att\NFT-zkp\
├── frontend/              ← npm install here
├── contracts/             ← npm install here
├── zkp/                   ← npm install here
└── (other files)
```

If `npm install` doesn't work, check you're in the right folder:
```bash
pwd  # Shows current folder
ls   # Should show package.json
```

---

## ⏱️ TIME ESTIMATE

| Step | Time | What Happens |
|------|------|--------------|
| Install Node.js | 5 min | Downloads & installs runtime |
| Frontend npm install | 2-3 min | Downloads React, ethers, snarkjs, vite |
| Contracts npm install | 2-3 min | Downloads Hardhat, plugins |
| ZKP npm install | 1-2 min | Downloads snarkjs |
| Verification | 2 min | Tests each installation |
| **TOTAL** | **~20 min** | Everything should work |

---

## 📚 WHAT TO READ NEXT

After npm install completes:

1. **DEPENDENCIES.md** (you just read this)
2. **DEPLOYMENT.md** ← Go here for next steps
3. Follow role-specific guide based on your position

---

## 💡 PRO TIPS

✅ **Do this:**
- Install Node.js first, restart computer
- Run npm install in each folder separately
- Wait for "added X packages" message

❌ **Don't do this:**
- Don't use `sudo npm install` (unless permission denied)
- Don't interrupt npm install halfway
- Don't run npm install in wrong folder

---

## 🎉 SUCCESS SIGNS

After each `npm install`:
```bash
npm list
```

Should show NO red errors, only package names and versions.

Example good output:
```
├── react@18.2.0
├── ethers@6.9.0
├── snarkjs@0.7.7
└── vite@5.0.0
```

Example bad output (has "UNMET DEPENDENCY"):
```
└── npm ERR! code ERESOLVE
```
→ Run: `npm install --legacy-peer-deps`

---

Ready? Start with Step 1: Install Node.js 👆
