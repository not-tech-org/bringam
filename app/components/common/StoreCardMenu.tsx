import React, { useState, useRef, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEdit2, FiUserPlus } from "react-icons/fi";
import { MdOutlineBlock } from "react-icons/md";

interface StoreCardMenuProps {
  onEdit: () => void;
  onAddMember: () => void;
  onDeactivate: () => void;
}

const StoreCardMenu: React.FC<StoreCardMenuProps> = ({
  onEdit,
  onAddMember,
  onDeactivate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 bg-white hover:bg-gray-50 rounded-full transition-colors"
      >
        <HiDotsHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg z-50 border border-gray-100 py-1.5">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Edit store details
          </button>
          <button
            onClick={() => {
              onAddMember();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Add members
          </button>
          <button
            onClick={() => {
              onDeactivate();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 bg-white hover:bg-red-50 transition-colors"
          >
            Deactivate store
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreCardMenu;
