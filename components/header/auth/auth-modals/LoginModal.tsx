'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { IoCloseCircleOutline } from 'react-icons/io5';
import classes from './auth-modals.module.css';
import { SignupButton } from '../auth-buttons/AuthButtons';
import { loginUser } from '@/lib/actions/auth';
import GoogleButton from './GoogleButton';

const loginDefaultValues = { email: '', password: '' };

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [data, action] = useActionState(loginUser, {
    success: false,
    message: '',
  });
  const { pending } = useFormStatus();

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Login</h2>

        <form action={action}>
          <input
            id='email'
            type='email'
            name='email'
            placeholder='Email'
            autoComplete='email'
            defaultValue={loginDefaultValues.email}
            required
          />
          <input
            id='password'
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='password'
            defaultValue={loginDefaultValues.password}
            required
          />

          <button className={classes.modalContentButton} type='submit'>
            {pending ? 'Logging In...' : 'Login'}
          </button>

          {data && !data.success && (
            <div className={classes.error}>{data.message}</div>
          )}
          {data && data.success && (
            <div className={classes.success}>{data.message}</div>
          )}
        </form>
        <GoogleButton />
        <button className={classes.closeButton} onClick={onClose}>
          <IoCloseCircleOutline />
        </button>

        <span className={classes.link}>
          <p className={classes.linkText}>Not registered yet?</p>
          <SignupButton />
        </span>
      </div>
    </div>
  );
}
