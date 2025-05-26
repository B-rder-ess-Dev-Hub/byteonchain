const { ethers } = require("hardhat");

async function deployFactory() {
  const CertificationFactory = await ethers.getContractFactory("CertificationFactory");
  const factory = await CertificationFactory.deploy();
  return factory;
}

async function createCertification(factory, name = "Test Course", symbol = "TEST", baseURI = "https://test.com/") {
  const [owner] = await ethers.getSigners();
  await factory.connect(owner).createCertification(name, symbol, baseURI);
  const certifications = await factory.getDeployedCertifications();
  const certification = await ethers.getContractAt("CertificationNFT", certifications[certifications.length - 1]);
  return certification;
}

module.exports = {
  deployFactory,
  createCertification
};