import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Componente Accordion (Sanfona) reutilizável.
 * 
 * @param title O conteúdo a ser exibido no cabeçalho do accordion.
 * @param children O conteúdo a ser exibido quando o accordion estiver expandido.
 */
const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <div>{title}</div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
