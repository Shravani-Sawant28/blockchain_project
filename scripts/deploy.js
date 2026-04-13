const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  if (Number(network.chainId) !== 31337) {
    throw new Error(`Expected chainId 31337, got ${network.chainId}`);
  }

  console.log("Deploying MembershipNFT on localhost...");
  console.log("Deployer:", deployer.address);

  const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
  const membership = await MembershipNFT.deploy(deployer.address);
  await membership.waitForDeployment();

  const contractAddress = await membership.getAddress();
  console.log("MembershipNFT deployed:", contractAddress);
  console.log(
    `Use in apps/web/.env.local -> NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS=${contractAddress}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
