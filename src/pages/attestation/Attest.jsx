import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSigner } from "./utils/wagmi-utils";
import styles from "../../styles/Classroom.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
// import { useSearchParams } from "react-router-dom";

const Attest = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const signer = useSigner();
  // const [searchParams] = useSearchParams();

  const [attest, setAttest] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  async function sendTransaction() {
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
        { name: "Name", value: "Primidac", type: "string" },
        { name: "Course", value: "Cyber Security", type: "string" },
        { name: "Score", value: 80 || "0", type: "uint256" },
        { name: "Issuer", value: "Borderless Community", type: "string" },
      ]);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: 0,
          revocable: false, // Must be false if schema is not revocable
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      console.log("New attestation UID:", newAttestationUID);
    }
  }
  useEffect(() => {
    async function connectEAS() {}

    if (signer) connectEAS();
  });

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.middleSection}>
            {/* <Recent /> */}
            {/* <Tupdate /> */}
          </div>
          <div className={styles.calendarSection}>
            {/* <CustomCalendar /> */}
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

      <div
        className={styles.buttonContainer}
        style={{
          marginTop: "300px",
        }}
      >
        <button className={styles.continueButton} onClick={sendTransaction}>
          Attest
        </button>
      </div>
    </div>
  );
};

export default Attest;
