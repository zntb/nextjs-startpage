'use client';

import { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import classes from './auth-modals.module.css';
import { LoginButton } from '../auth-buttons/AuthButtons';

export default function SignupModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    console.log('User Registered:', formData);
    onClose();
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Sign Up</h2>
        {error && <p className={classes.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button className={classes.modalContentButton} type='submit'>
            Register
          </button>
          <span className={classes.link}>
            <p className={classes.linkText}>Already have an account?</p>
            <LoginButton />
          </span>
        </form>
        <button className={classes.closeButton} onClick={onClose}>
          <IoCloseCircleOutline />
        </button>
      </div>
    </div>
  );
}
