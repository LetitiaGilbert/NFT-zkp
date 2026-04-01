const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ZKP NFT Verification contracts...\n");

  // Deploy Verifier
  console.log("📋 Deploying Verifier contract...");
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  console.log("✓ Verifier deployed to:", verifier.address);

  // Deploy NFTVerification
  console.log("\n📋 Deploying NFTVerification contract...");
  const NFTVerification = await hre.ethers.getContractFactory("NFTVerification");
  const nftVerification = await NFTVerification.deploy(verifier.address);
  await nftVerification.deployed();
  console.log("✓ NFTVerification deployed to:", nftVerification.address);

  // Save addresses
  console.log("\n📝 Saving deployment addresses...");
  const fs = require("fs");
  const deployment = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString(),
    contracts: {
      Verifier: verifier.address,
      NFTVerification: nftVerification.address,
    },
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deployment, null, 2)
  );

  console.log("✓ Deployment config saved to deployment.json");

  console.log("\n✅ Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Copy Verifier address to frontend: ${verifier.address}`);
  console.log("2. Update src/utils/constants.js with VERIFIER_ADDRESS");
  console.log("3. Start frontend: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
