import { Outlet } from 'react-router-dom';
import Header from './header/Header.tsx';
import './Layout.css';

const Index = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 SafePay. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Index;
