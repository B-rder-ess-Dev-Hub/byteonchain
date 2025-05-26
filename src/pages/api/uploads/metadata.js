// /pages/api/metadata.js
import { pinataSDK } from "../../../../utils/pinata";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, description, image } = req.body;

  if (!name || !description || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const metadata = {
    name,
    description,
    image,
  };

  try {
    const result = await pinataSDK.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `metadata-${name}`,
      },
    });

    const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    return res.status(200).json({ url });
  } catch (err) {
    console.error("Metadata upload error:", err);
    return res.status(500).json({ error: "Metadata upload failed" });
  }
}
