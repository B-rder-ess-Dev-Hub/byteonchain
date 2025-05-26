// /utils/config.js
import pinataSDK from "@pinata/sdk";


const pinata = new pinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
  pinataSecretApiKey: process.env.PINATA_APISECRET,
  pinataApiKey: process.env.PINATA_APIKEY,
});

export { pinata as pinataSDK };