import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "../utils/wagmi-utils";
import styles from "../../../styles/Attest.module.css"; // Import CSS for button styling

const Attest = ({ walletAddress, score, course }) => {
  const signer = useSigner();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null); // Removed TypeScript annotation

  // Fetch user's name using wallet address
  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserName(data.user.fullname || "Unknown User");
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Unknown User");
      }
    };

    if (walletAddress) {
      fetchName();
    }
  }, [walletAddress]);

  async function sendTransaction() {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    setLoading(true);
    try {
      const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
      const schemaUID = "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb";
      const eas = new EAS(easContractAddress);
      await eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("string Name,string Course,uint256 Score,string Issuer");
      const encodedData = schemaEncoder.encodeData([
        { name: "Name", value: userName || "Unknown", type: "string" },
        { name: "Course", value: course, type: "string" },
        { name: "Score", value: score || 0, type: "uint256" },
        { name: "Issuer", value: "Borderless Community", type: "string" },
      ]);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: walletAddress,
          expirationTime: 0,
          revocable: false,
          data: encodedData,
        },
        overrides: { gasLimit: 1000000 },
      });

      const newAttestationUID = await tx.wait();
      if (newAttestationUID) {
        window.open(`https://arbitrum.easscan.org/attestation/view/${newAttestationUID}`);
      }
      console.log("New attestation UID:", newAttestationUID);
    } catch (error) {
      console.error("Attestation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={styles.attestButton} onClick={sendTransaction} disabled={loading}>
      {loading ? "Attesting..." : "Attest"}
    </button>
  );
};

export default Attest;