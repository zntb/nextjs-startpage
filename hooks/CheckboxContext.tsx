'use client';

import { createContext, useContext, useState } from 'react';

type CheckboxContextType = {
  isDropdownCheckboxChecked: boolean;
  isBackgroundCheckboxChecked: boolean;
  toggleDropdownCheckbox: () => void;
  toggleBackgroundCheckbox: () => void;
  setIsDropdownCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBackgroundCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined,
);

export const CheckboxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDropdownCheckboxChecked, setIsDropdownCheckboxChecked] =
    useState(false);
  const [isBackgroundCheckboxChecked, setIsBackgroundCheckboxChecked] =
    useState(false);

  const toggleDropdownCheckbox = () => {
    setIsDropdownCheckboxChecked(prev => !prev);
  };

  const toggleBackgroundCheckbox = () => {
    setIsBackgroundCheckboxChecked(prev => !prev);
  };

  const contextValue: CheckboxContextType = {
    isDropdownCheckboxChecked,
    isBackgroundCheckboxChecked,
    toggleDropdownCheckbox,
    toggleBackgroundCheckbox,
    setIsDropdownCheckboxChecked,
    setIsBackgroundCheckboxChecked,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckbox = (): CheckboxContextType => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('useCheckbox must be used within a CheckboxProvider');
  }
  return context;
};
