'use client';

import { useState } from 'react';
import SignupModal from '../auth-modals/SignupModal';
import classes from './auth-buttons.module.css';

export function SignupButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={classes.signupButton} onClick={() => setIsOpen(true)}>
        Sign Up
      </button>
      {isOpen && <SignupModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
export function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={classes.signupButton} onClick={() => setIsOpen(true)}>
        Login
      </button>
      {isOpen && <SignupModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
