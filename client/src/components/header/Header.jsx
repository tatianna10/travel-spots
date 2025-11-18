import { Link } from "react-router";

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-left">
                <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="header-logo"
                />
                <h1 className="header-title">TRAVEL SPOTS</h1>
            </div>

            <nav className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/places">Catalog</Link>
                <Link to="/create/spot">Create Spot</Link>
                <Link to="/logout">Logout</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
        </header>
    );
}
