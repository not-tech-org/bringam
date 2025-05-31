import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { MdWarning } from "react-icons/md";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  type?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  type = "warning",
}) => {
  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-black p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${getIconColor()}`}
          >
            <MdWarning size={24} />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            secondary
            style="border-2 px-6"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonStyle()} ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
