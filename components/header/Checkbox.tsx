'use client';

import { useCurrentUser } from '@/hooks/useSession';
import classes from './main-header.module.css';

type CheckboxProps = {
  isChecked: boolean;
  onCheckboxChange: () => void;
  label: string;
};

const Checkbox = ({ isChecked, onCheckboxChange, label }: CheckboxProps) => {
  const user = useCurrentUser();

  if (!user) return null;

  return (
    <div className={classes.checkboxItem}>
      <label
        className={`${classes.checkbox} ${isChecked ? classes.checked : ''}`}
      >
        {label} &nbsp;
        <input
          type='checkbox'
          className={classes.checkmark}
          checked={isChecked}
          onChange={onCheckboxChange}
        />
      </label>
    </div>
  );
};

export default Checkbox;
