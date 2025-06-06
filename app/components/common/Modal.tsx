import React, { ReactNode, useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeIcon?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeIcon,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-11/12 md:w-1/2 max-w-lg bg-white p-6 pt-8 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {closeIcon && (
          <div
            className="absolute top-4 right-8 mt-0 bg-transparent border border-1 p-6 cursor-pointer rounded-lg text-[#1D1D1F]"
            onClick={onClose}
          >
            <RxCross2 size={20} />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
