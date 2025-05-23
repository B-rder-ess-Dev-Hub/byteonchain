import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "./wagmi-utils";
import styles from "../src/styles/Attest.module.css";
import { useChainId } from 'wagmi';
import { networks } from './config/networks';
import { ethers } from 'ethers'; // ethers v6

const Attest = ({ walletAddress, score, course, issuer, onAttestationSuccess }) => {
  const signer = useSigner();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const chainId = useChainId();
  const matchingNetwork = networks.find(network => network.chainId === chainId);
  const API_KEY = process.env.NEXT_PUBLIC_BYTE_API_KEY || '';

  useEffect(() => {
    const fetchName = async (address) => {
      try {
        if (!address) {
          console.log("No wallet address provided for fetching user data");
          setUserName("Unknown User");
          return;
        }

        // Validate and checksum the wallet address
        let formattedAddress;
        try {
          // Basic format check
          if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error('Invalid Ethereum address format');
          }
          // Use ethers.getAddress for checksum (for on-chain use)
          formattedAddress = ethers.getAddress(address);
        } catch (error) {
          console.error("Invalid wallet address:", address, error);
          setUserName("Unknown User");
          return;
        }

        // Convert to lowercase for API call
        const apiAddress = address.toLowerCase();

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

    if (walletAddress) {
      fetchName(walletAddress);
    } else {
      setUserName("Unknown User");
    }
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
      console.log(`Matching network found: ${matchingNetwork.name} Chain ID: ${matchingNetwork.chainId}`);
      const easContractAddress = matchingNetwork.easContractAddress;
      const eas = new EAS(easContractAddress);
      eas.connect(signer);

      const OnboardingschemaEncoder = new SchemaEncoder("string Name,string Onboarding_Event,uint256 Score,string Issuer");
      const ONboardingencodedData = OnboardingschemaEncoder.encodeData([
        { name: "Name", value: userName, type: "string" },
        { name: "Onboarding_Event", value: course, type: "string" },
        { name: "Score", value: score || 0, type: "uint256" },
        { name: "Issuer", value: issuer, type: "string" },
      ]);

      const tx = await eas.attest({
        schema: matchingNetwork.OnboardingSchemaUID,
        data: {
          recipient: walletAddress,
          expirationTime: 0,
          revocable: false,
          data: ONboardingencodedData,
        },
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

export default Attest;