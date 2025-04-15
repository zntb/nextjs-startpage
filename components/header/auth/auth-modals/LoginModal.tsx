'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import classes from './auth-modals.module.css';
import { SignupButton } from '../auth-buttons/AuthButtons';
import { loginUser } from '@/lib/actions/auth';
import GoogleButton from './GoogleButton';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [data, action] = useActionState(loginUser, {
    success: false,
    message: '',
    errors: {},
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { pending } = useFormStatus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
            value={formData.email}
            onChange={handleChange}
            required
          />
          {data.errors?.email && (
            <p className={classes.error}>{data.errors.email}</p>
          )}
          <input
            id='password'
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          {data.errors?.password && (
            <p className={classes.error}>{data.errors.password}</p>
          )}

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
          <IoMdClose />
        </button>

        <span className={classes.link}>
          <p className={classes.linkText}>Not registered yet?</p>
          <SignupButton />
        </span>
      </div>
    </div>
  );
}
