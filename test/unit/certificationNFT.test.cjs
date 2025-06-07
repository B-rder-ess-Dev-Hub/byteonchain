const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("CertificationNFT", function () {
  let certNFT;
  let owner, otherUser;

  beforeEach(async () => {
    [owner, otherUser] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("CertificationNFT");
    certNFT = await upgrades.deployProxy(NFT, [
      "CertNFT",
      "CNFT",
      "https://example.com/metadata/",
      owner.address,
    ]);
    // remove .deployed()
  });

  it("should initialize correctly", async () => {
    expect(await certNFT.name()).to.equal("CertNFT");
    expect(await certNFT.symbol()).to.equal("CNFT");
  });

  it("should mint certificate and set data", async () => {
    await certNFT.connect(otherUser).safeMint("Certificate for User");

    expect(await certNFT.ownerOf(0)).to.equal(otherUser.address);
    expect(await certNFT.getCertificateDetails(0)).to.equal("Certificate for User");
  });

  it("should return correct tokenURI", async () => {
    await certNFT.connect(otherUser).safeMint("Cert");

    const tokenURI = await certNFT.tokenURI(0);
    expect(tokenURI).to.equal("https://example.com/metadata/Cert");
  });

  it("should update baseURI", async () => {
    await certNFT.updateBaseURI("https://newuri.com/");

    await certNFT.connect(otherUser).safeMint("Cert");
    const uri = await certNFT.tokenURI(0);

    expect(uri).to.equal("https://newuri.com/Cert");
  });

  it("should increment tokenIds correctly", async () => {
    await certNFT.connect(otherUser).safeMint("First Cert");
    await certNFT.connect(otherUser).safeMint("Second Cert");

    expect(await certNFT.ownerOf(0)).to.equal(otherUser.address);
    expect(await certNFT.ownerOf(1)).to.equal(otherUser.address);
  });

  it("should revert when querying tokenURI for nonexistent token", async () => {
    await expect(certNFT.tokenURI(9999)).to.be.reverted; // generic revert check
  });


  it("should allow multiple minters to mint", async () => {
    await certNFT.connect(owner).safeMint("Owner Cert");
    await certNFT.connect(otherUser).safeMint("User Cert");

    expect(await certNFT.ownerOf(0)).to.equal(owner.address);
    expect(await certNFT.ownerOf(1)).to.equal(otherUser.address);
  });
});
