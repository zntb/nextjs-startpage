'use client';

import { useActionState } from 'react';
import { createLinkInCategory } from '@/lib/actions';
import toast from 'react-hot-toast';
import classes from './dropdown.module.css';
import { useState } from 'react';

type DropdownFormProps = {
  onClose: () => void;
  categoryId: string;
};

const initialState = {
  message: '',
  success: false,
};

function AddDropdownForm({ onClose, categoryId }: DropdownFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction] = useActionState(
    createLinkInCategory,
    initialState,
  );
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);

      formData.append('categoryId', categoryId);

      const result = await createLinkInCategory(data, formData);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Error updating link' });
      console.log('Error updating link:', error);
    }
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={classes.dropdownUpdateForm}
    >
      <label htmlFor='title'>Title</label>
      <input
        type='text'
        id='title'
        name='title'
        required
        className={`${classes.dropdownLinkTitle} ${
          errors.title ? classes.errorInput : ''
        }`}
      />
      {errors.title && <p className={classes.errorText}>{errors.title}</p>}
      <label htmlFor='url'>URL</label>
      <input
        type='text'
        id='url'
        name='url'
        required
        className={`${classes.dropdownLinkUrl} ${
          errors.url ? classes.errorInput : ''
        }`}
      />
      {errors.url && <p className={classes.errorText}>{errors.url}</p>}
      {errors.general && (
        <p className={classes.dropdownError}>{errors.general}</p>
      )}
      <button className={classes.actionButton} type='submit'>
        Add Link
      </button>
    </form>
  );
}

export default AddDropdownForm;
