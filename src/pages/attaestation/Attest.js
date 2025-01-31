import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSigner } from "./utils/wagmi-utils";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Attest = async () => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const [userName, setUserName] = useState("Unknown");

  useEffect(() => {
    if (address) {
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`https://byteapi-two.vercel.app/api/user/${address}`);
          if (response.data.status === "success") {
            setUserName(response.data.user.fullname); // Set the user's full name from the API
          } else {
            setUserName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName("Unknown");
        }
      };

      fetchUserName();
    }
  }, [address]);

  const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
  const schemaUID = "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb";
  const eas = new EAS(easContractAddress);

  if (!isConnected || !address) {
    return (
      <div>
        <h3>Please connect your wallet to proceed with the attestation</h3>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      </div>
    );
  }

  const signer = await useSigner(); // Assuming you already have this function set up
  await eas.connect(signer);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("string Name,string Course,uint256 Score,string Issuer");

  const encodedData = schemaEncoder.encodeData([
    { name: "Name", value: userName, type: "string" }, // Use the fetched userName here
    { name: "Course", value: "Cyber Security", type: "string" },
    { name: "Score", value: "80", type: "uint256" },
    { name: "Issuer", value: "Borderless", type: "string" }
  ]);

  try {
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address, // Use the connected user's address as recipient
        expirationTime: 0,
        revocable: true,
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
  } catch (error) {
    console.error("Error during attestation:", error);
  }

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
    </div>
  );
};

export default Attest;