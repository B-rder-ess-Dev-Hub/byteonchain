import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { useSigner } from "./wagmi-utils";


const signer = useSigner();
const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
const eas = new EAS(easContractAddress);
eas.connect(signer);

// Schema UID
const schemaUID = '0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe';

// Function to fetch attestations
async function fetchFilteredAttestations(schemaUID, fieldName, fieldValue) {
  try {
    const attestations = await eas.getAttestations({ schema: schemaUID });

    // Filter attestations based on the field value
    const filtered = attestations.filter(attestation => {
      const decodedData = new SchemaEncoder(attestation.schema).decodeData(attestation.data);
      return decodedData.some(field => field.name === fieldName && field.value.toString() === fieldValue);
    });

    console.log(filtered);
    return filtered;
  } catch (error) {
    console.error('Error fetching attestations:', error);
  }
}

fetchFilteredAttestations(schemaUID, 'Onboarding_event', 'BUK');
