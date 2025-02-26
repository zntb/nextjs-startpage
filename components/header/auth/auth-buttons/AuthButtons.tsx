'use client';

import { useAuthModal } from '@/hooks/AuthModalProvider';
import classes from './auth-buttons.module.css';

export function AuthButton() {
  const { openModal } = useAuthModal();

  return (
    <button
      className={classes.signupButton}
      onClick={() => openModal('signup')}
    >
      Signup/Login
    </button>
  );
}

export function SignupButton() {
  const { openModal } = useAuthModal();

  return (
    <button className={classes.authButtons} onClick={() => openModal('signup')}>
      Sign Up
    </button>
  );
}

export function LoginButton() {
  const { openModal } = useAuthModal();

  return (
    <button className={classes.authButtons} onClick={() => openModal('login')}>
      Login
    </button>
  );
}
