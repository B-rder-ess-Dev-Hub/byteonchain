"use client";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { factoryABI } from "../../utils/NFT/ABI/NFTABI";
import { createNewCertification } from "../../utils/NFT/createCertificateContract";

export default function CreateCertification() {
  const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  const FACTORY_ABI = factoryABI;

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient(); // ✅ replaces useSigner()

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [baseURI, setBaseURI] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");

  const handleCreateCertification = async () => {
    if (!walletClient || !isConnected) {
      alert("Wallet not connected.");
      return;
    }

    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await ethersProvider.getSigner();

    if (!name || !symbol || !baseURI) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setDeploying(true);
      const proxyAddress = await createNewCertification(signer, name, symbol, baseURI);
      setDeployedAddress(proxyAddress);
    } catch (err) {
      alert("Failed to deploy certification.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Create Certification NFT</h1>
      <input
        type="text"
        placeholder="Name"
        className="border px-2 py-1 w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Symbol"
        className="border px-2 py-1 w-64"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="text"
        placeholder="Base URI"
        className="border px-2 py-1 w-64"
        value={baseURI}
        onChange={(e) => setBaseURI(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleCreateCertification}
        disabled={deploying}
      >
        {deploying ? "Deploying..." : "Create Certification"}
      </button>

      {deployedAddress && (
        <div className="mt-4 text-center">
          <p>✅ Deployed Certification Proxy:</p>
          <a
            href={`https://sepolia.etherscan.io/address/${deployedAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {deployedAddress}
          </a>
        </div>
      )}
    </main>
  );
}
