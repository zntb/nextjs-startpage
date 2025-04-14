import { IoMdClose } from 'react-icons/io';
import classes from './modal.module.css';

type DropdownModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function DropdownModal({ isVisible, onClose, children }: DropdownModalProps) {
  if (!isVisible) return null;

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={onClose}>
          <IoMdClose />
        </button>
        {children}
      </div>
    </div>
  );
}

export default DropdownModal;
