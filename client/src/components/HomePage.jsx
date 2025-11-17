export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')" }}>
      {/* Header */}
      <div className="relative z-10">
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 py-4 px-6 flex justify-between items-center rounded-b-xl shadow-lg">
          <div className="flex items-center gap-3">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Logo" className="w-8 h-8 drop-shadow-[0_0_15px_#1E90FF]" />

            <h1 className="text-2xl font-bold text-[#1E90FF] drop-shadow-[0_0_15px_#1E90FF] drop-shadow-[0_0_35px_#66b3ff] drop-shadow-[0_0_55px_#b3d9ff] drop-shadow-[0_0_70px_#ffffff] brightness-125">TRAVEL SPOTS</h1>
          </div>
          <nav className="flex gap-6 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Home</a>
            <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Catalog</a>
            <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Login</a>
            <a href="#" className="hover:text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Register</a>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="relative">
            <div className="absolute inset-0 bg-black/30 rounded-xl z-0"></div>
            <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-2xl">Explore Places</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {/* Sample Card */}
              {[
                {
                  id: 1,
                  title: "Paris, France",
                  img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
                  desc: "The romantic city of lights with stunning architecture and rich culture."
                },
                {
                  id: 2,
                  title: "New York, USA",
                  img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
                  desc: "The iconic skyline and fast-paced lifestyle of the Big Apple."
                },
                {
                  id: 3,
                  title: "Tokyo, Japan",
                  img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
                  desc: "A perfect blend of modern neon streets and traditional temples."
                }
              ].map(place => (
                <div key={place.id} className="group relative z-10 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 hover:brightness-110">
                  <img
                    src={place.img}
                    alt={place.title}
                    className="h-48 w-full object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-bold mt-3 text-center text-white drop-shadow-[0_0_6px_#000000aa]">{place.title}</h3>
                  <p className="text-white mt-1 line-clamp-2 text-center px-4 drop-shadow-[0_0_6px_#000000aa]">{place.desc}</p>
                  <button className="mt-4 mx-auto block bg-blue-500/20 backdrop-blur-md border border-blue-300/40 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500/30 transition-colors duration-300 hover:shadow-xl transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white/20 backdrop-blur-md border-t border-white/30 text-center py-4 mt-12 rounded-t-xl shadow-lg text-white">
          <p className="text-white text-sm drop-shadow-2xl">
            © {new Date().getFullYear()} Travel Spots — All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}