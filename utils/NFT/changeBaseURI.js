import { ethers } from 'ethers'; // ethers v6
import { nftABI } from './ABI/NFTABI';

import { fetchNFTurl } from './tokenURI';

export async function mintCertificate(proxyAddress, BaseURI, signer) {
  try {
    const contract = new ethers.Contract(proxyAddress, nftABI, signer);
    const tx = await contract.updateBaseURI(BaseURI);
    const receipt = await tx.wait();

    console.log("Base URI updated!", receipt);
    return;
  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
}
