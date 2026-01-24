import { Link } from 'react-router';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getDisplayName } from '../../utils/formatters';

export default function Header({ showBrand = false }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = useMemo(() => getDisplayName(user), [user]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      {showBrand ? (
        <div className="header-left">
          <img src="/images/logo.png" alt="Logo" className="header-logo" />
          <h1 className="header-title">TRAVEL SPOTS</h1>
        </div>
      ) : (
        <div className="header-left header-placeholder"></div>
      )}

      <button
        type="button"
        className="header-burger"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((v) => !v)}
      >
        <span className="burger-bar" />
        <span className="burger-bar" />
        <span className="burger-bar" />
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/places" onClick={closeMenu}>Catalog</Link>

        {isAuthenticated ? (
          <>
            <Link to="/places/create" onClick={closeMenu}>Create Spot</Link>
            <Link to="/places/my-places" onClick={closeMenu}>My Places</Link>

            <div className="header-auth">
              <span className="header-user">Hello, {displayName}</span>
              <button
                type="button"
                className="logout-btn"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
