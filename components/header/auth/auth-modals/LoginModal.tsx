'use client';

import { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import classes from './auth-modals.module.css';

export default function SignupModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

          <button className={classes.modalContentButton} type='submit'>
            Register
          </button>
        </form>
        <button className={classes.closeButton} onClick={onClose}>
          <IoCloseCircleOutline />
        </button>
      </div>
    </div>
  );
}
