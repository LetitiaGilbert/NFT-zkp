# 🚀 START HERE: DEPENDENCIES & INSTALLATION

**3 Simple Steps. Copy-paste commands. Takes 20 minutes.**

---

## 📋 THE 3 COMMANDS YOU NEED

Run these three commands, one after another. That's it.

```bash
# 1️⃣ FRONTEND
cd frontend
npm install

# 2️⃣ SMART CONTRACTS
cd ../contracts
npm install

# 3️⃣ ZKP CIRCUIT
cd ../zkp
npm install
```

Each one takes 2-3 minutes. After all three finish, you're done!

---

## ⚠️ BEFORE YOU START

### Do you have Node.js installed?

```bash
node --version
```

**If you see a version number (v16+ or higher):** ✅ Skip to commands above

**If you see "command not found":**
1. Go to https://nodejs.org/
2. Download "LTS" version
3. Run installer (click through defaults)
4. Restart computer
5. Then run the three commands above

---

## ✅ AFTER INSTALLATION (Verify)

```bash
# Frontend works?
cd frontend && npm run dev
# Should open http://localhost:3000
# Press Ctrl+C to stop

# Contracts work?
cd ../contracts && npx hardhat test
# Should show "1 passing"

# Circuit works?
cd ../zkp && node prove.js
# Should show "✓ Proof generated"
```

All three should work without errors.

---

## 🐛 COMMON PROBLEMS & FIXES

| Problem | Fix |
|---------|-----|
| **"command not found"** | Install Node.js from https://nodejs.org/ |
| **Installation hangs** | Press Ctrl+C, then: `npm cache clean --force && npm install` |
| **"ERESOLVE" error** | Run: `npm install --legacy-peer-deps` |
| **"Permission denied"** | Run: `sudo npm install` |
| **"disk space full"** | Delete node_modules: `rm -rf node_modules`, free up 2GB |

---

## 📚 DETAILED GUIDES

For more info, see:
- `INSTALL_QUICK.md` - Quick reference
- `DEPENDENCIES.md` - Complete guide

---

## 🎯 YOU'RE READY!

After the 3 npm install commands finish:

✅ Frontend ready (`npm run dev`)
✅ Contracts ready (`npx hardhat test`)
✅ Circuit ready (`node prove.js`)

**Next:** Read `DEPLOYMENT.md` for launch sequence

---

**Questions?** Check the detailed guides. Installation is straightforward—Node.js → npm install → done!
