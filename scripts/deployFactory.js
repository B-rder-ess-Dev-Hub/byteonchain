const hre = require("hardhat");

async function main() {
  const CertificationFactory = await hre.ethers.getContractFactory("CertificationFactory");
  const factory = await CertificationFactory.deploy();
  
  await factory.waitForDeployment();

  console.log("CertificationFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});