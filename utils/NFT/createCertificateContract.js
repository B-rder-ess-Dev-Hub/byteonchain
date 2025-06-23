import { ethers } from 'ethers'; // ethers v6
import { factoryABI } from './ABI/NFTABI';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
const FACTORY_ABI = factoryABI;

// Example function to connect and interact
export async function createNewCertification(signer, name, symbol, baseURI) {
    try {
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const tx = await factory.createCertification(name, symbol, baseURI);
      const receipt = await tx.wait();

      const iface = new ethers.Interface(FACTORY_ABI);
      const log = receipt.logs.find(
        (l) => l.topics[0] === iface.getEvent("CertificationCreated").topicHash
      );
      const event = iface.parseLog(log);
      return event.args.certificationProxy;
    } catch (err) {
      console.error("Error creating certification:", err);
      throw err;
    }
  }

export async function getAllCertifications(provider) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  const certifications = await factory.getDeployedCertifications();
  return certifications;
}