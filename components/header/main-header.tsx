'use client';

import dynamic from 'next/dynamic';
import { useCheckbox } from '@/hooks/CheckboxContext';
import { AuthButton } from './auth/auth-buttons/AuthButtons';
import classes from './main-header.module.css';
import { useCurrentUser } from '@/hooks/useSession';
import { signOut } from 'next-auth/react';

const Checkbox = dynamic(() => import('./Checkbox'), {
  ssr: false,
});

const userName = process.env.NEXT_PUBLIC_USER!.toLowerCase();

function MainHeader() {
  const { isChecked, toggleCheckbox } = useCheckbox();

  const user = useCurrentUser();

  // console.log('session user: ', user);

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
        <Checkbox isChecked={isChecked} onCheckboxChange={toggleCheckbox} />
      </nav>
    </header>
  );
}

export default MainHeader;
