import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu-container">
      <div className={`hamburger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><a href="/settings">Settings</a></li>
            <li><NavLink to="/">Dashboard</NavLink></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
