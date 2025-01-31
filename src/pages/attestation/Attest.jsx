import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
<<<<<<< HEAD
=======
import { useSigner } from "./utils/wagmi-utils";
import styles from "../../styles/Classroom.module.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
>>>>>>> 709d318face457d143177728d9e12811edcf643b
// import { useSearchParams } from "react-router-dom";

const Attest = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
<<<<<<< HEAD
  const { data: signer } = useSigner();
  const [searchParams] = useSearchParams();
=======
  const signer = useSigner();
  // const [searchParams] = useSearchParams();
>>>>>>> 709d318face457d143177728d9e12811edcf643b

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
<<<<<<< HEAD
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
=======
    async function connectEAS() {}
>>>>>>> 709d318face457d143177728d9e12811edcf643b

    if (signer) connectEAS();
  });

  return (
<<<<<<< HEAD
    <div>
      <h3>Connect Your Wallet</h3>
=======
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

>>>>>>> 709d318face457d143177728d9e12811edcf643b
      {!isConnected && (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
<<<<<<< HEAD
      <input placeholder="Address/ENS" value={address} onChange={(e) => setAddress(e.target.value)} />
      {ensResolvedAddress && <img src="/ens-logo.png" alt="ENS Logo" />}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} />
      <input placeholder="Issuer Name" value={issuer} onChange={(e) => setIssuerName(e.target.value)} />
=======

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
>>>>>>> 709d318face457d143177728d9e12811edcf643b
    </div>
  );
};

export default Attest;