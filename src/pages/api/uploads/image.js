// /pages/api/upload.js
import { IncomingForm } from "formidable";
import fs from "fs";
import { pinataSDK } from "../../../../utils/pinata";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const uploadedFile = files.file?.[0];
    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const stream = fs.createReadStream(uploadedFile.filepath);
      const result = await pinataSDK.pinFileToIPFS(stream, {
        pinataMetadata: {
          name: uploadedFile.originalFilename || "uploaded-file",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      return res.status(200).json({ url });
    } catch (uploadErr) {
      console.error("Pinata upload error:", uploadErr);
      return res.status(500).json({ error: "Upload to Pinata failed" });
    }
  });
}
