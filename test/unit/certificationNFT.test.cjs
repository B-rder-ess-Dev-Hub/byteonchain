const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CertificationNFT", function () {
  async function deployCertificationFixture() {
    const [owner, student, other] = await ethers.getSigners();
    
    const CertificationNFT = await ethers.getContractFactory("CertificationNFT");
    const certification = await CertificationNFT.deploy(
      "Web3 Developer",
      "WEB3",
      "https://api.example.com/certs/"
    );

    return { certification, owner, student, other };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { certification } = await loadFixture(deployCertificationFixture);
      expect(await certification.name()).to.equal("Web3 Developer");
      expect(await certification.symbol()).to.equal("WEB3");
    });

    it("Should set the right owner", async function () {
      const { certification, owner } = await loadFixture(deployCertificationFixture);
      expect(await certification.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new certificate", async function () {
      const { certification, owner, student } = await loadFixture(deployCertificationFixture);
      
      await expect(certification.connect(owner).safeMint(student.address, "Course completed with distinction"))
        .to.emit(certification, "Transfer")
        .withArgs(ethers.ZeroAddress, student.address, 0);
      
      expect(await certification.ownerOf(0)).to.equal(student.address);
    });

    it("Should store certificate details", async function () {
      const { certification, owner, student } = await loadFixture(deployCertificationFixture);
      const details = "Course completed with distinction";
      
      await certification.connect(owner).safeMint(student.address, details);
      expect(await certification.getCertificateDetails(0)).to.equal(details);
    });

    it("Should prevent non-owners from minting", async function () {
      const { certification, student, other } = await loadFixture(deployCertificationFixture);
      
      await expect(
        certification.connect(other).safeMint(student.address, "Unauthorized mint")
      ).to.be.revertedWithCustomError(certification, "OwnableUnauthorizedAccount");
    });
  });

  describe("Metadata", function () {
    it("Should return correct token URI", async function () {
      const { certification, owner, student } = await loadFixture(deployCertificationFixture);
      await certification.connect(owner).safeMint(student.address, "Test");
      
      expect(await certification.tokenURI(0)).to.equal(
        "https://api.example.com/certs/0"
      );
    });

    it("Should allow owner to update base URI", async function () {
      const { certification, owner, student } = await loadFixture(deployCertificationFixture);
      await certification.connect(owner).safeMint(student.address, "Test");
      
      const newURI = "https://new-api.example.com/certs/";
      await certification.connect(owner).updateBaseURI(newURI);
      expect(await certification.tokenURI(0)).to.equal(newURI + "0");
    });

    it("Should prevent non-owners from updating base URI", async function () {
      const { certification, other } = await loadFixture(deployCertificationFixture);
      
      await expect(
        certification.connect(other).updateBaseURI("https://malicious.com/")
      ).to.be.revertedWithCustomError(certification, "OwnableUnauthorizedAccount");
    });
  });
});