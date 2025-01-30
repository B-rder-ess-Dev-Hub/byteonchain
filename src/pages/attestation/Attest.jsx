import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSigner } from "./utils/wagmi-utils";
import { useSearchParams } from "react-router-dom";

const Attest = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const signer = useSigner();
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
    if (addressParam) {
      setAddress(addressParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const issuerParam = searchParams.get("issuer");
    if (issuerParam) {
      setIssuerName(issuerParam);
    }

    const nameParam = searchParams.get("name");
    if (nameParam) {
      setName(nameParam);
    }
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
      const schemaUID =
        "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb";
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
            revocable: true, // Must be false if schema is not revocable
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
    <div className={styles.container}>
      <Header />
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.middleSection}>
            <Recent />
            <Tupdate />
          </div>
          <div className={styles.calendarSection}>
            <CustomCalendar />
          </div>
        </div>
      </div>

      {!isConnected && (
        <div className={styles.walletOverlay}>
          <div className={styles.walletContent}>
            <h3>Connect Your Wallet</h3>
            <p>Please connect your wallet to access the platform</p>
            <button
              className={styles.connectWalletButton}
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      <InputContainer>
        <InputBlock
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Address/ENS"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {ensResolvedAddress && <EnsLogo src="/ens-logo.png" />}
      </InputContainer>
      <InputContainer>
        <InputBlock
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <InputBlock
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <InputBlock
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <InputBlock
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Issuer Name"
          value={issuer}
          onChange={(e) => setIssuerName(e.target.value)}
        />
      </InputContainer>
    </div>
  );
};

export default Attest;
