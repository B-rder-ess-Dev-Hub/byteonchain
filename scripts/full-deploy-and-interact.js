const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // 1️⃣ Deploy the Factory
    const CertificationFactory = await hre.ethers.getContractFactory("CertificationFactory");
    const factory = await CertificationFactory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ CertificationFactory deployed to:", factoryAddress);

    // 2️⃣ Call createCertification() to deploy a new CertificationNFT proxy
    const createTx = await factory.createCertification(
        "Mamashay Vendor Pass",
        "Mama",
        "https://rose-cheap-minnow-324.mypinata.cloud/ipfs/"
    );
    const receipt = await createTx.wait();

    // Decode logs manually
    const iface = new hre.ethers.Interface([
        "event CertificationCreated(address indexed certificationProxy, string name, string symbol)"
    ]);

    let event;
    for (const log of receipt.logs) {
        try {
            const parsed = iface.parseLog(log);
            if (parsed.name === "CertificationCreated") {
                event = parsed;
                break;
            }
        } catch (e) {
            // Skip non-matching logs
        }
    }

    if (!event) throw new Error("CertificationCreated event not found");

    const newProxy = event.args.certificationProxy;
    console.log("✅ Certification NFT Proxy deployed to:", newProxy);

    // 3️⃣ Interact with the proxy (CertificationNFT)
    const CertificationNFT = await hre.ethers.getContractAt("CertificationNFT", newProxy);

    // Mint a certificate
    const mintTx = await CertificationNFT.safeMint("QmbJPNetTkQfFzev2yqVijReATEfSnxPvf2xajmJ6CGYXG");
    await mintTx.wait();
    console.log("✅ Certificate minted!");

    // Fetch tokenURI
    const tokenUri = await CertificationNFT.tokenURI(0);
    console.log("📄 Token URI of token 0:", tokenUri);

    // Fetch raw cert data
    const data = await CertificationNFT.getCertificateDetails(0);
    console.log("📜 Certificate Data:", data);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exitCode = 1;
});
