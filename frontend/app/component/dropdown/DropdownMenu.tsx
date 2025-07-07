import { useState } from 'react';
import { useAuth } from '~/hook/useAuth';
import './dropdown.css';
import { IoIosArrowDown } from 'react-icons/io';

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        <IoIosArrowDown size={16} color="#fff" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
