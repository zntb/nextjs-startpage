'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCheckbox } from '@/hooks/CheckboxContext';
import { AuthButton } from './auth/auth-buttons/AuthButtons';
import ImageSelectorModal from '../background-image/image-selector-modal';
import { useCurrentUser } from '@/hooks/useSession';
import { signOut } from 'next-auth/react';
import classes from './main-header.module.css';

const Checkbox = dynamic(() => import('./Checkbox'), {
  ssr: false,
});

const userName = process.env.NEXT_PUBLIC_USER!.toLowerCase();

type Wallpaper = {
  id: string;
  url: string;
};

function MainHeader() {
  const {
    isDropdownCheckboxChecked,
    isBackgroundCheckboxChecked,
    toggleDropdownCheckbox,
    toggleBackgroundCheckbox,
    setIsBackgroundCheckboxChecked,
  } = useCheckbox();

  const [isBackgroundModalVisible, setIsBackgroundModalVisible] =
    useState(false);

  const [backgroundImage, setBackgroundImage] = useState(
    '/images/background.jpg',
  );
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  const user = useCurrentUser();

  useEffect(() => {
    const savedImage = localStorage.getItem('selectedBackgroundImage');
    if (savedImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBackgroundImage(savedImage);
    }
  }, []);

  useEffect(() => {
    const bgElement = document.getElementById('dynamic-bg');
    if (bgElement && backgroundImage) {
      bgElement.style.backgroundImage = `url(${backgroundImage})`;
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (isBackgroundModalVisible) {
      const fetchWallpapers = async () => {
        const res = await fetch('/api/wallpapers');
        const data = await res.json();
        setWallpapers(data);
      };
      fetchWallpapers();
    }
  }, [isBackgroundModalVisible]);

  const handleSelectImage = (image: string) => {
    setBackgroundImage(image);
    localStorage.setItem('selectedBackgroundImage', image);
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsBackgroundModalVisible(false);
    setIsBackgroundCheckboxChecked(false);
  };

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul>
          <li>
            <a href={`https://github.com/${userName}`}>Github</a>
          </li>
          <li>
            <a href='https://chat.openai.com/chat'>ChatGPT</a>
          </li>
          {user ? (
            <li>
              <button
                className={classes.signOutButton}
                onClick={() => signOut()}
              >
                Signout
              </button>
            </li>
          ) : (
            <li>
              <AuthButton />
            </li>
          )}
        </ul>
        <div className={classes.checkboxContainer}>
          <Checkbox
            isChecked={isDropdownCheckboxChecked}
            onCheckboxChange={toggleDropdownCheckbox}
            label='Update DL'
          />
          <hr />
          <Checkbox
            isChecked={isBackgroundCheckboxChecked}
            onCheckboxChange={() => {
              if (!isBackgroundCheckboxChecked) {
                setIsBackgroundModalVisible(true);
              }
              toggleBackgroundCheckbox();
            }}
            label='Update BG'
          />
        </div>
      </nav>
      <ImageSelectorModal
        isVisible={isBackgroundModalVisible}
        onClose={handleModalClose}
        images={wallpapers}
        onSelectImage={handleSelectImage}
        onUpdateWallpapers={setWallpapers}
      />
    </header>
  );
}

export default MainHeader;
