import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "./wagmi-utils";
import styles from "../src/styles/Attest.module.css";
import { useChainId } from 'wagmi';
import { networks } from './config/networks';
import { ethers } from 'ethers'; // ethers v6

const AttestGeneral = ({ walletAddress, score, course, issuer, onAttestationSuccess }) => {
  const signer = useSigner();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const chainId = useChainId();
  const matchingNetwork = networks.find(network => network.chainId === chainId);
  const API_KEY = process.env.NEXT_PUBLIC_BYTE_API_KEY || '';

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (!walletAddress) {
          console.log("No wallet address provided for fetching user data");
          setUserName("Unknown User");
          return;
        }

        // Validate and checksum the wallet address
        let formattedAddress;
        try {
          // Basic format check
          if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
            throw new Error('Invalid Ethereum address format');
          }
          // Use ethers.getAddress for checksum (for on-chain use)
          formattedAddress = ethers.getAddress(walletAddress);
        } catch (error) {
          console.error("Invalid wallet address:", walletAddress, error);
          setUserName("Unknown User");
          return;
        }

        // Convert to lowercase for API call
        const apiAddress = walletAddress.toLowerCase();

        const response = await fetch(`https://byteapi-two.vercel.app/api/user/${apiAddress}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Bytekeys": API_KEY || ''
          }
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setUserName(data.user?.fullname || "Unknown User");
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Unknown User");
      }
    };

    fetchName();
  }, [walletAddress, API_KEY]);

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
        { name: "Issuer", value: issuer, type: "string" },
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
        onAttestationSuccess(newAttestationUID);
      }
    } catch (error) {
      console.error("Attestation failed:", error);
      alert("Attestation failed. Please try again.");
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