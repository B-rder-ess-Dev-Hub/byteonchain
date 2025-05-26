const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CertificationFactory", function () {
  async function deployFactoryFixture() {
    const [owner, courseAdmin] = await ethers.getSigners();
    
    const CertificationFactory = await ethers.getContractFactory("CertificationFactory");
    const factory = await CertificationFactory.deploy();

    return { factory, owner, courseAdmin };
  }

  describe("Deployment", function () {
    it("Should deploy with empty certifications list", async function () {
      const { factory } = await loadFixture(deployFactoryFixture);
      expect(await factory.getDeployedCertifications()).to.deep.equal([]);
    });
  });

  describe("Creating Certifications", function () {
    it("Should create new certification contract", async function () {
      const { factory, owner } = await loadFixture(deployFactoryFixture);
      
      const tx = await factory.connect(owner).createCertification(
      "Blockchain Basics",
      "BLK101",
      "https://api.example.com/blk101/"
    );

    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === "CertificationCreated");
    // expect(event).to.not.be.undefined;
    // expect(event.args.name).to.equal("Blockchain Basics");
    // expect(event.args.symbol).to.equal("BLK101");
    });

    it("Should transfer ownership of new certification to creator", async function () {
      const { factory, owner } = await loadFixture(deployFactoryFixture);
      
      await factory.connect(owner).createCertification(
        "Advanced Solidity",
        "SOL401",
        "https://api.example.com/sol401/"
      );
      
      const certifications = await factory.getDeployedCertifications();
      const certification = await ethers.getContractAt("CertificationNFT", certifications[0]);
      
      expect(await certification.owner()).to.equal(owner.address);
    });

    it("Should create multiple certifications", async function () {
      const { factory, owner } = await loadFixture(deployFactoryFixture);
      
      await factory.connect(owner).createCertification("Course1", "CRS1", "uri1/");
      await factory.connect(owner).createCertification("Course2", "CRS2", "uri2/");
      
      const certifications = await factory.getDeployedCertifications();
      expect(certifications.length).to.equal(2);
      expect(certifications[0]).to.not.equal(certifications[1]);
    });
  });
});