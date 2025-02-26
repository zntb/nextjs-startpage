'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { IoCloseCircleOutline } from 'react-icons/io5';
import classes from './auth-modals.module.css';
import { LoginButton } from '../auth-buttons/AuthButtons';
import { registerUser } from '@/lib/actions/auth';
import GoogleButton from './GoogleButton';

export default function SignupModal({ onClose }: { onClose: () => void }) {
  const [data, action] = useActionState(registerUser, {
    success: false,
    message: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { pending } = useFormStatus();

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Sign Up</h2>

        <form action={action}>
          <input
            id='name'
            type='text'
            name='name'
            placeholder='Name'
            autoComplete='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <input
            id='confirmPassword'
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            autoComplete='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button className={classes.modalContentButton} type='submit'>
            {pending ? 'Submitting...' : 'Sign Up'}
          </button>

          {data && !data.success && (
            <div className={classes.error}>{data.message}</div>
          )}
          {data && data.success && (
            <div className={classes.success}>{data.message}</div>
          )}
        </form>
        <GoogleButton />

        <span className={classes.link}>
          <p className={classes.linkText}>Already have an account?</p>
          <LoginButton />
        </span>

        <button className={classes.closeButton} onClick={onClose}>
          <IoCloseCircleOutline />
        </button>
      </div>
    </div>
  );
}
