import React from "react";
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="logo">
                    <h1>🚚 Fleet Manager</h1>
                </div>

                <nav className="navigation>">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/schedule"
                        className={`nav-link ${location.pathname === '/schedule' ? 'active' : ''}`}
                    >
                        Schedule
                    </Link>
                    <Link
                        to="/jobs"
                        className={`nav-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                    > Manage jobs</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;