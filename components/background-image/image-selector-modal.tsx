import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { RiUploadCloudFill } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/wallpapers', {
      method: 'POST',
      body: formData,
    });

    if (images.length >= 5) {
      toast.error('You have reached the limit of 5 images, please delete some');
      return;
    }

    if (res.ok) {
      const newWallpaper = await res.json();
      onUpdateWallpapers([...images, newWallpaper]);
      toast.success('Image uploaded successfully');
      setFile(null);
      setPreviewUrl(null);
    } else {
      toast.error('Failed to upload image');
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
      toast.success('Image deleted successfully');
    } else {
      toast.error('Failed to delete image');
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
          onChange={e => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);
            setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
          }}
          className={classes.fileInput}
        />
        {previewUrl && (
          <div className={classes.previewContainer}>
            <Image
              src={previewUrl}
              alt='Selected preview'
              width={120}
              height={120}
              className={classes.previewImage}
            />
          </div>
        )}
        <button className={classes.uploadButton} onClick={handleUpload}>
          <RiUploadCloudFill /> &nbsp; Upload
        </button>
        <div className={classes.imageGrid}>
          {images.map(wallpaper => (
            <div key={wallpaper.id} className={classes.imageItem}>
              <Image
                src={wallpaper.url}
                alt='Background'
                width={1920}
                height={1080}
                quality={100}
                className={classes.image}
                onClick={() => {
                  onSelectImage(wallpaper.url);
                  onClose();
                }}
                priority
              />

              <button
                className={classes.deleteButton}
                onClick={() => {
                  toast.custom(
                    t => (
                      <div className={classes.confirmToast}>
                        <span>Delete this wallpaper?</span>
                        <div className={classes.toastActions}>
                          <button
                            onClick={() => {
                              handleDelete(wallpaper.id);
                              toast.dismiss(t.id);
                            }}
                          >
                            Yes
                          </button>
                          <button onClick={() => toast.dismiss(t.id)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ),
                    {
                      duration: 30000,
                      position: 'top-center',
                    },
                  );
                }}
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
