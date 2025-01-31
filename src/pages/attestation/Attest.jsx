import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
// import { useSearchParams } from "react-router-dom";

const Attest = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: signer } = useSigner();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  const [issuer, setIssuerName] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ensResolvedAddress, setEnsResolvedAddress] = useState("");

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) setAddress(addressParam);

    const issuerParam = searchParams.get("issuer");
    if (issuerParam) setIssuerName(issuerParam);

    const nameParam = searchParams.get("name");
    if (nameParam) setName(nameParam);
  }, [searchParams]);

  useEffect(() => {
    async function checkENS() {
      if (address.includes(".eth")) {
        const tmpAddress = await getAddressForENS(address);
        setEnsResolvedAddress(tmpAddress || "");
      } else {
        setEnsResolvedAddress("");
      }
    }
    checkENS();
  }, [address]);

  useEffect(() => {
    async function connectEAS() {
      const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
      const schemaUID = "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb";
      const eas = new EAS(easContractAddress);

      if (signer) {
        await eas.connect(signer);
        const schemaEncoder = new SchemaEncoder(
          "string Name,string Course,uint256 Score,string Issuer"
        );

        const encodedData = schemaEncoder.encodeData([
          { name: "Name", value: name, type: "string" },
          { name: "Course", value: title, type: "string" },
          { name: "Score", value: score || "0", type: "uint256" },
          { name: "Issuer", value: issuer, type: "string" },
        ]);

        const tx = await eas.attest({
          schema: schemaUID,
          data: {
            recipient: "0x0000000000000000000000000000000000000000",
            expirationTime: 0,
            revocable: true, 
            data: encodedData,
          },
        });

        const newAttestationUID = await tx.wait();
        console.log("New attestation UID:", newAttestationUID);
      }
    }

    if (signer) connectEAS();
  }, [signer, name, title, score, issuer]);

  return (
    <div>
      <h3>Connect Your Wallet</h3>
      {!isConnected && (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
      <input placeholder="Address/ENS" value={address} onChange={(e) => setAddress(e.target.value)} />
      {ensResolvedAddress && <img src="/ens-logo.png" alt="ENS Logo" />}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} />
      <input placeholder="Issuer Name" value={issuer} onChange={(e) => setIssuerName(e.target.value)} />
    </div>
  );
};

export default Attest;