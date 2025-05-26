const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CertificationFactory Integration", function () {
  async function deployFactoryAndCertificationFixture() {
    const [owner, student] = await ethers.getSigners();
    
    const CertificationFactory = await ethers.getContractFactory("CertificationFactory");
    const factory = await CertificationFactory.deploy();
    
    // Create a certification through the factory
    await factory.connect(owner).createCertification(
      "Web3 Developer",
      "WEB3",
      "https://api.example.com/certs/"
    );
    
    const certifications = await factory.getDeployedCertifications();
    const certification = await ethers.getContractAt("CertificationNFT", certifications[0]);
    
    return { factory, certification, owner, student };
  }

  it("Should allow minting through created certification contract", async function () {
    const { certification, owner, student } = await loadFixture(deployFactoryAndCertificationFixture);
    
    await certification.connect(owner).safeMint(student.address, "Certified Web3 Developer");
    expect(await certification.ownerOf(0)).to.equal(student.address);
  });

  it("Should maintain separate state for different certifications", async function () {
    const { factory, owner, student } = await loadFixture(deployFactoryAndCertificationFixture);
    
    // Create a second certification
    await factory.connect(owner).createCertification(
      "Blockchain Security",
      "SEC101",
      "https://api.example.com/sec101/"
    );
    
    const certifications = await factory.getDeployedCertifications();
    
    // Get contract instances
    const firstCert = await ethers.getContractAt("CertificationNFT", certifications[0]);
    const secondCert = await ethers.getContractAt("CertificationNFT", certifications[1]);
    
    // Mint certificates from both contracts
    await firstCert.connect(owner).safeMint(student.address, "Web3 Cert");
    await secondCert.connect(owner).safeMint(student.address, "Security Cert");
    
    // Verify they have separate token IDs
    expect(await firstCert.ownerOf(0)).to.equal(student.address);
    expect(await secondCert.ownerOf(0)).to.equal(student.address);
  });

  it("Should allow metadata customization per certification", async function () {
    const { factory, owner, student } = await loadFixture(deployFactoryAndCertificationFixture);
    
    await factory.connect(owner).createCertification(
      "Custom Metadata",
      "META",
      "https://custom.api/certs/"
    );
    
    const certifications = await factory.getDeployedCertifications();
    const metaCertification = await ethers.getContractAt("CertificationNFT", certifications[1]);
    
    // Mint a token first before checking URI
    await metaCertification.connect(owner).safeMint(student.address, "Test Certificate");
    
    expect(await metaCertification.tokenURI(0)).to.equal("https://custom.api/certs/0");
  });
});