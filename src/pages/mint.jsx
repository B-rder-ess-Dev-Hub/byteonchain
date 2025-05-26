"use client";
import { useState } from "react";

export default function Mint() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUrl(result.url);
      } else {
        console.error(result.error);
        alert("Upload failed: " + result.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const uploadMetadata = async () => {
    const res = await fetch("/api/uploads/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "My NFT",
        description: "This is my awesome NFT",
        image: "https://gateway.pinata.cloud/ipfs/QmNacayW96inZmH2V7CQC782Si5F57nrZNjaFAtbjcBerm",
      }),
    });
  
    const data = await res.json();
    console.log("Metadata IPFS URL:", data);
  };
  
 

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile instanceof Blob) {
            setFile(selectedFile);
          } else {
            alert("Invalid file");
          }
        }}
      />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <button onClick={uploadMetadata} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {url && (
        <div className="mt-4">
          <p>Uploaded file:</p>
          <img src={url} alt="Uploaded" style={{ maxWidth: "300px" }} />
          <p>
            URL:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
