import { Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function Header({ showBrand = false }) {
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    return (
        <header className="site-header">

            {showBrand ? (
                <div className="header-left">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="header-logo"
                    />
                    <h1 className="header-title">TRAVEL SPOTS</h1>
                </div>
            ) : (
                <div className="header-left header-placeholder"></div>
            )}

            <nav className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/places">Catalog</Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/places/create">Create Spot</Link>

                        <Link to="/places/my-places">My Places</Link>

                        <span className="header-user">
                            Hello, {user.fullName?.trim() || user.email.split("@")[0]}
                        </span>

                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
