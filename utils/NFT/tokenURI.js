import { ethers } from 'ethers'; // ethers v6
import { nftABI } from './ABI/NFTABI';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
const FACTORY_ABI = nftABI;

export async function fetchNFTurl(proxyAddress, signerOrProvider) {
  try {
    const contract = new ethers.Contract(proxyAddress, nftABI, signerOrProvider);
    
    // This is a view function: returns string, no wait() needed
    const certificateData = await contract.tokenURI();

    console.log("📄 Certificate Data:", certificateData);
    return certificateData;
  } catch (error) {
    console.error("❌ Error fetching certificate data:", error);
    throw error;
  }
}
