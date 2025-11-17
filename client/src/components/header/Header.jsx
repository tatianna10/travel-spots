export default function Header() {
    return (
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 py-4 px-6 flex justify-between items-center rounded-b-xl shadow-lg">
            <div className="flex items-center gap-3">
                <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Logo" className="w-8 h-8 drop-shadow-[0_0_15px_#1E90FF]" />

                <h1 className="text-2xl font-bold text-[#1E90FF] drop-shadow-[0_0_15px_#1E90FF] drop-shadow-[0_0_35px_#66b3ff] drop-shadow-[0_0_55px_#b3d9ff] drop-shadow-[0_0_70px_#ffffff] brightness-125">TRAVEL SPOTS</h1>
            </div>
            <nav className="flex gap-6 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Home</a>
                <a to="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Catalog</a>
                <a to="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Create Spot</a>
                <a to="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Logout</a>
                <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Login</a>
                <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Register</a>
            </nav>
        </header>

    );
}