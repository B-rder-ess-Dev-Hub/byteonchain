import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "./wagmi-utils";
import styles from "../src/styles/Attest.module.css"; // Import CSS for button styling
import { useAccount, useSwitchChain, useChainId, } from 'wagmi';
import { networks } from './config/networks';

const AttestGeneral = ({ walletAddress, score, course, issuer, onAttestationSuccess }) => {
  const signer = useSigner();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const chainId = useChainId()
  const matchingNetwork = networks.find(network => network.chainId === chainId);


  useEffect(() => {
    const fetchName = async () => {
      try {
        if (!walletAddress) return;

        const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserName(data.user.fullname || "Unknown User");
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Unknown User");
      }
    };

    fetchName();
  }, [walletAddress]);

  async function sendTransaction() {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!userName) {
      alert("Fetching user name, please wait...");
      return;
    }

    if (!issuer) {
      alert("Issuer information is missing!");
      return;
    }

    setLoading(true);
    try {

      const easContractAddress = matchingNetwork.easContractAddress;
      const eas = new EAS(easContractAddress);
      await eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("string Name,string Course,uint256 Score,string Issuer");
      const encodedData = schemaEncoder.encodeData([
        { name: "Name", value: userName, type: "string" },
        { name: "Course", value: course, type: "string" },
        { name: "Score", value: score || 0, type: "uint256" },
        { name: "Issuer", value: issuer, type: "string" }, // 🔥 Issuer is now dynamic!
      ]);

      const tx = await eas.attest({
        schema: matchingNetwork.courseSchemaUID,
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
        onAttestationSuccess(newAttestationUID); // Notify parent component of successful attestation
      }
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

export default AttestGeneral;