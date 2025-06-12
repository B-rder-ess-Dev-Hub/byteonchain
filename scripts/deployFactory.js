const hre = require("hardhat");

async function main() {
  const CertificationFactory = await hre.ethers.getContractFactory("CertificationFactory");
  const factory = await CertificationFactory.deploy();

  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log("✅ CertificationFactory deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
