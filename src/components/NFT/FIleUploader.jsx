'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { url } = await response.json();
      setIpfsUrl(url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="file"
          name='file'
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          accept="image/*,.pdf"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload to IPFS'}
        </button>
      </form>
      
      {ipfsUrl && (
        <div>
          <p>File uploaded to:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener">
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
}