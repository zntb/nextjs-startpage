'use client';

import dynamic from 'next/dynamic';
import { useCheckbox } from '@/hooks/CheckboxContext';
import { SignupButton } from './auth/auth-buttons/AuthButtons';
import classes from './main-header.module.css';

const Checkbox = dynamic(() => import('./Checkbox'), {
  ssr: false,
});

// const userName = process.env.USER!.toLowerCase();
const userName = 'zntb';

function MainHeader() {
  const { isChecked, toggleCheckbox } = useCheckbox();

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul>
          <li>
            <SignupButton />
          </li>
          <li>
            <a href={`https://github.com/${userName}`}>Github</a>
          </li>
          <li>
            <a href='https://chat.openai.com/chat'>ChatGPT</a>
          </li>
        </ul>
        <Checkbox isChecked={isChecked} onCheckboxChange={toggleCheckbox} />
      </nav>
    </header>
  );
}

export default MainHeader;
