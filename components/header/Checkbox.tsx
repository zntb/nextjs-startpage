'use client';

import classes from './main-header.module.css';

type CheckboxProps = {
  isChecked: boolean;
  onCheckboxChange: () => void;
};

const Checkbox = ({ isChecked, onCheckboxChange }: CheckboxProps) => {
  return (
    <label
      className={`${classes.checkbox} ${isChecked ? classes.checked : ''}`}
    >
      Update &nbsp;
      <input
        type="checkbox"
        className={classes.checkmark}
        checked={isChecked}
        onChange={onCheckboxChange}
      />
    </label>
  );
};

export default Checkbox;
