import classes from './modal.module.css';

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isVisible, onClose, children }: ModalProps) {
  if (!isVisible) return null;

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
