"use client";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { mintCertificate } from "../../utils/NFT/mintCertificate";

export default function MintCertification() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [proxyAddress, setProxyAddress] = useState("");
  const [certificateData, setCertificateData] = useState("");
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleMint = async () => {
    if (!isConnected || !walletClient) {
      alert("Connect your wallet first.");
      return;
    }

    if (!proxyAddress || !certificateData) {
      alert("Fill all fields");
      return;
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();

      setMinting(true);
      const { txHash, imageUrl } = await mintCertificate(proxyAddress, certificateData, signer);

      setTxHash(txHash);
      setImageUrl(imageUrl);
    } catch (err) {
      alert(err.message || err);
    } finally {
      setMinting(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Mint Your Certification</h1>

      <input
        type="text"
        placeholder="Certification Contract Address"
        className="border px-2 py-1 w-64"
        value={proxyAddress}
        onChange={(e) => setProxyAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Certificate Data (e.g., CID or ID)"
        className="border px-2 py-1 w-64"
        value={certificateData}
        onChange={(e) => setCertificateData(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleMint}
        disabled={minting}
      >
        {minting ? "Minting..." : "Mint Certificate"}
      </button>

      {txHash && (
        <div className="mt-4 text-center">
          <p>✅ Minted Successfully!</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}

      {imageUrl && (
        <div className="mt-6">
          <p className="text-lg font-semibold">📄 Your Certificate Image:</p>
          <img
            src={imageUrl}
            alt="Certificate"
            className="mt-2 border rounded-lg shadow-md max-w-xs"
          />
        </div>
      )}
    </main>
  );
}
