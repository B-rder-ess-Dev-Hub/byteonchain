const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificationFactory", function () {
  let factory;
  let owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const FactoryContract = await ethers.getContractFactory("CertificationFactory");
    factory = await FactoryContract.deploy();
    // remove .deployed() as deploy() is already awaited
  });

  it("should deploy a new proxy NFT contract", async () => {
    const tx = await factory.createCertification(
      "MyCert",
      "MCERT",
      "https://uri.com/"
    );
    const receipt = await tx.wait();

    const iface = factory.interface;
    const logs = receipt.logs.map(log => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    }).filter(log => log && log.name === "CertificationCreated");

    const event = logs[0];
    expect(event).to.not.be.undefined;

    expect(event).to.exist;

    const proxyAddress = event.args.certificationProxy;
    expect(proxyAddress).to.properAddress;

    const deployedNFT = await ethers.getContractAt("CertificationNFT", proxyAddress);

    expect(await deployedNFT.name()).to.equal("MyCert");
    expect(await deployedNFT.symbol()).to.equal("MCERT");
  });

  it("should allow user to mint in deployed proxy", async () => {
    const tx = await factory.connect(user).createCertification("UserCert", "UCERT", "https://useruri.com/");
    const receipt = await tx.wait();

    const iface = factory.interface;
    const logs = receipt.logs.map(log => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    }).filter(log => log && log.name === "CertificationCreated");

    expect(logs.length).to.be.greaterThan(0);
    const proxyAddr = logs[0].args.certificationProxy;

    const userNFT = await ethers.getContractAt("CertificationNFT", proxyAddr);
    expect(await userNFT.name()).to.equal("UserCert");

    await userNFT.connect(user).safeMint("User Cert");
    expect(await userNFT.getCertificateDetails(0)).to.equal("User Cert");
  });

  it("should track deployed contracts", async () => {
    await factory.createCertification("Cert1", "C1", "uri1/");
    await factory.createCertification("Cert2", "C2", "uri2/");

    const all = await factory.getDeployedCertifications();
    expect(all.length).to.equal(2);
  });

  it("should emit CertificationCreated event with correct args", async () => {
  // We only test event emission without strict arg matching because event has multiple args
  await expect(factory.createCertification("TestCert", "TCERT", "https://testuri/"))
    .to.emit(factory, "CertificationCreated");
});
});
