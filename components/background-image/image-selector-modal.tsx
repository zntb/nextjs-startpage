'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import classes from './image-selector-modal.module.css';

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  images: string[];
  onSelectImage: (image: string) => void;
};

const ImageSelectorModal = ({
  isVisible,
  onClose,
  images,
  onSelectImage,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Select Background Image</h2>
        <div className={classes.imageGrid}>
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt='Background'
              width={100}
              height={100}
              className={classes.image}
              onClick={() => onSelectImage(image)}
            />
          ))}
        </div>
        <button className={classes.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageSelectorModal;
