'use client';

import { useState } from 'react';

export default function UploadWallpaper() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/wallpapers/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Upload successful!');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div>
      <input
        type='file'
        accept='image/*'
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={upload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}
