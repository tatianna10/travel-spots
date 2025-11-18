import { Link } from "react-router";

export default function Header() {
    return (
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 py-4 px-6 flex justify-between items-center rounded-b-xl shadow-lg">
            <div className="flex items-center gap-3">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
                    alt="Logo"
                    className="w-8 h-8 drop-shadow-[0_0_15px_#1E90FF]"
                />

                <h1 className="text-2xl font-bold text-[#1E90FF] drop-shadow-[0_0_15px_#1E90FF]">
                    TRAVEL SPOTS
                </h1>
            </div>

            <nav className="flex gap-6 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <Link to="/" className="hover:text-blue-300">Home</Link>
                <Link to="/places" className="hover:text-blue-300">Catalog</Link>
                <Link to="/create/spot" className="hover:text-blue-300">Create Spot</Link>
                <Link to="/logout" className="hover:text-blue-300">Logout</Link>
                <Link to="/login" className="hover:text-blue-300">Login</Link>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
            </nav>
        </header>
    );
}
