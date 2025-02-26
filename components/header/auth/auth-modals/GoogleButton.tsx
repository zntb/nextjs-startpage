'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import classes from './auth-modals.module.css';
export default function GoogleButton() {
  return (
    <div className={classes.google}>
      <button className={classes.googleButton} onClick={() => signIn('google')}>
        <Image src='/google.png' alt='Google Logo' width={20} height={20} />
        <span>Sign up with Google</span>
      </button>
    </div>
  );
}
