'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCheckbox } from '@/hooks/CheckboxContext';
import { AuthButton } from './auth/auth-buttons/AuthButtons';
import ImageSelectorModal from '../background-image/image-selector-modal';
import { BACKGROUND_IMAGES } from '@/lib/constants';
import { useCurrentUser } from '@/hooks/useSession';
import { signOut } from 'next-auth/react';
import classes from './main-header.module.css';

const Checkbox = dynamic(() => import('./Checkbox'), {
  ssr: false,
});

const userName = process.env.NEXT_PUBLIC_USER!.toLowerCase();

function MainHeader() {
  const {
    isDropdownCheckboxChecked,
    isBackgroundCheckboxChecked,
    toggleDropdownCheckbox,
    toggleBackgroundCheckbox,
  } = useCheckbox();

  const [isModalVisible, setModalVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    '/images/background.jpg',
  );

  const user = useCurrentUser();

  const handleSelectImage = (image: string) => {
    setBackgroundImage(image);
    localStorage.setItem('selectedBackgroundImage', image);
    setModalVisible(false);
    if (isBackgroundCheckboxChecked) {
      toggleBackgroundCheckbox();
    }
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('selectedBackgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  useEffect(() => {
    const bgElement = document.getElementById('dynamic-bg');
    if (bgElement && backgroundImage) {
      bgElement.style.backgroundImage = `url(${backgroundImage})`;
    }
  }, [backgroundImage]);

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
              toggleBackgroundCheckbox();
              setModalVisible(true);
            }}
            label='Update BG'
          />
        </div>
      </nav>
      <ImageSelectorModal
        isVisible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          if (isBackgroundCheckboxChecked) {
            toggleBackgroundCheckbox();
          }
        }}
        images={BACKGROUND_IMAGES}
        onSelectImage={handleSelectImage}
      />
    </header>
  );
}

export default MainHeader;
