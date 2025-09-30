import React, { ReactNode, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

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
      className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60]"
      onClick={onClose}
    >
        <motion.div
          className="relative w-11/12 md:w-1/2 max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {closeIcon && (
            <motion.button
              className="absolute top-3 right-3 z-10 p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RxCross2 className="text-gray-500 text-base" />
            </motion.button>
          )}
          <div className="p-5">
            {children}
          </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal;
