'use client';

import { createContext, useContext, useState } from 'react';

// Define a type for the context value
type CheckboxContextType = {
  isChecked: boolean;
  toggleCheckbox: () => void;
};

// Create the context with initial value of undefined
const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined
);

// Create a provider component
export const CheckboxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked((prev) => !prev);
  };

  // Value of the context provider
  const contextValue: CheckboxContextType = {
    isChecked,
    toggleCheckbox,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      {children}
    </CheckboxContext.Provider>
  );
};

// Custom hook to use the context
export const useCheckbox = (): CheckboxContextType => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('useCheckbox must be used within a CheckboxProvider');
  }
  return context;
};
