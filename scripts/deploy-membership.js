const { ethers, network } = require("hardhat");

/**
 * MembershipNFT Deployment Script
 *
 * Usage:
 *   npx hardhat run scripts/deploy-membership.js --network localhost
 */

async function main() {
  // ── 1. Get deployer account ──────────────────────────────────────
  const [deployer] = await ethers.getSigners();

  console.log("─────────────────────────────────────────────────");
  console.log("  🚀 Deploying MembershipNFT Contract");
  console.log("─────────────────────────────────────────────────");
  console.log("  Deployer address :", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("  Deployer balance :", ethers.formatEther(balance), "ETH");
  console.log("─────────────────────────────────────────────────\n");

  // ── 2. Get contract factory ──────────────────────────────────────
  const MembershipNFT = await ethers.getContractFactory("MembershipNFT");

  // ── 3. Deploy ────────────────────────────────────────────────────
  console.log("  Deploying contract...");
  const membership = await MembershipNFT.deploy(deployer.address);

  // ── 4. Wait for deployment to be mined ───────────────────────────
  await membership.waitForDeployment();

  const contractAddress = await membership.getAddress();

  // ── 5. Print summary ─────────────────────────────────────────────
  console.log("\n  ✅ MembershipNFT deployed successfully!\n");
  console.log("─────────────────────────────────────────────────");
  console.log("  Contract address  :", contractAddress);
  console.log("  Contract owner    :", deployer.address);
  console.log("─────────────────────────────────────────────────");

  // ── 6. Print default tier info ───────────────────────────────────
  console.log("\n  📋 Default Membership Tiers:");
  console.log("  ┌──────────────┬──────────────┬────────────────┐");
  console.log("  │ Tier         │ Duration     │ Price          │");
  console.log("  ├──────────────┼──────────────┼────────────────┤");
  console.log("  │ MONTHLY (0)  │ 30 days      │ 0.01 ETH       │");
  console.log("  │ BIANNUAL (1) │ 180 days     │ 0.05 ETH       │");
  console.log("  │ ANNUAL (2)   │ 365 days     │ 0.08 ETH       │");
  console.log("  └──────────────┴──────────────┴────────────────┘");

  // ── 7. Print .env hint ───────────────────────────────────────────
  console.log("\n  📝 Add this to apps/web/.env.local:");
  console.log(`  NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS=${contractAddress}`);
  console.log("─────────────────────────────────────────────────\n");

  if (network.name !== "localhost" && network.name !== "hardhat") {
    throw new Error("This script is configured for localhost only.");
  }

  console.log("  🎉 Local deployment complete!\n");
}

// ── Entry point ────────────────────────────────────────────────────
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n  ❌ Deployment failed:", error);
    process.exit(1);
  });