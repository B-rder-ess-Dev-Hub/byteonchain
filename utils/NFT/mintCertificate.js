import { ethers } from 'ethers'; // ethers v6
import { nftABI } from './ABI/NFTABI';

import { fetchNFTurl } from './tokenURI';

export async function mintCertificate(proxyAddress, certificateData, signer) {
  try {
    const contract = new ethers.Contract(proxyAddress, nftABI, signer);
    const tx = await contract.safeMint(certificateData);
    const receipt = await tx.wait();

    console.log("Certificate Minted!", receipt);

    const imageUrl = await fetchNFTurl(proxyAddress, signer);
    return {
      txHash: receipt.hash,
      imageUrl: imageUrl,
    };
  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
}
