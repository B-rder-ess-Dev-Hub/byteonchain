import  { EAS, SchemaEncoder }  from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSigner } from "./utils/wagmi-utils";

 Attest = () => {
const { isConnected } = useAccount();
const { openConnectModal } = useConnectModal();

const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const schemaUID = "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb";
const eas = new EAS(easContractAddress);
// Signer must be an ethers-like signer.
await eas.connect(signer);
// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("string Name,string Course,uint256 Score,string Issuer");
const encodedData = schemaEncoder.encodeData([
	{ name: "Name", value: "", type: "string" },
	{ name: "Course", value: "", type: "string" },
	{ name: "Score", value: "0", type: "uint256" },
	{ name: "Issuer", value: "", type: "string" },
]);
const tx = await eas.attest({
	schema: schemaUID,
	data: {
		recipient: "0x0000000000000000000000000000000000000000",
		expirationTime: 0,
		revocable: true, // Be aware that if your schema is not revocable, this MUST be false
		data: encodedData,
	},
});
const newAttestationUID = await tx.wait();
console.log("New attestation UID:", newAttestationUID);

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