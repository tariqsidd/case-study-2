import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">SafePay</Link>
        </div>
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Students</NavLink>
          <NavLink to="/find-student" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Find Student</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
