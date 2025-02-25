'use client';

import { createContext, useContext, useState } from 'react';
import SignupModal from '../components/header/auth/auth-modals/SignupModal';
import LoginModal from '../components/header/auth/auth-modals/LoginModal';

type ModalType = 'signup' | 'login' | null;

interface AuthModalContextType {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal, activeModal }}>
      {children}

      {activeModal === 'signup' ? <SignupModal onClose={closeModal} /> : null}
      {activeModal === 'login' ? <LoginModal onClose={closeModal} /> : null}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
