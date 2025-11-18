import { Link } from "react-router";

export default function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
                    alt="Logo"
                    className="header-logo"
                />
                <h1 className="header-title">TRAVEL SPOTS</h1>
            </div>

            <nav className="header-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/places" className="nav-link">Catalog</Link>
                <Link to="/create" className="nav-link">Create Spot</Link>
                <Link to="/logout" className="nav-link">Logout</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
            </nav>
        </header>
    );
}
