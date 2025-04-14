import { useState } from 'react';
import Image from 'next/image';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { RiUploadCloudFill } from 'react-icons/ri';
import classes from './image-selector-modal.module.css';

type Wallpaper = {
  id: string;
  url: string;
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectImage: (image: string) => void;
  images: Wallpaper[];
  onUpdateWallpapers: (wallpapers: Wallpaper[]) => void;
};

const ImageSelectorModal = ({
  isVisible,
  onClose,
  onSelectImage,
  images,
  onUpdateWallpapers,
}: ModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/wallpapers', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const newWallpaper = await res.json();
      onUpdateWallpapers([...images, newWallpaper]);
      setFile(null);
    } else {
      alert('Upload failed');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/wallpapers', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      onUpdateWallpapers(images.filter(w => w.id !== id));
    } else {
      alert('Delete failed');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={onClose}>
          <IoMdClose />
        </button>
        <h2>Select Background Image</h2>
        <input
          type='file'
          accept='image/*'
          onChange={e => setFile(e.target.files?.[0] || null)}
          className={classes.fileInput}
        />
        <button className={classes.uploadButton} onClick={handleUpload}>
          <RiUploadCloudFill /> &nbsp; Upload
        </button>
        <div className={classes.imageGrid}>
          {images.map(wallpaper => (
            <div key={wallpaper.id} className={classes.imageItem}>
              <Image
                src={wallpaper.url}
                alt='Background'
                width={100}
                height={100}
                className={classes.image}
                onClick={() => {
                  onSelectImage(wallpaper.url);
                  onClose();
                }}
              />
              <button
                className={classes.deleteButton}
                onClick={() => handleDelete(wallpaper.id)}
              >
                <FaRegTrashAlt style={{ color: 'red' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;
