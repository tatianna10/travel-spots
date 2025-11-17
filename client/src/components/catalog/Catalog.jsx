import { Link } from "react-router";

export default function CatalogPage() {
  const places = [
    {
      id: 1,
      title: "Paris, France",
      img: "https://images2.alphacoders.com/561/thumb-1920-561115.jpg",
      desc: "The romantic city of lights with stunning architecture and rich culture."
    },
    {
      id: 2,
      title: "New York, USA",
      img: "https://lh3.googleusercontent.com/places/AAcXr8oELGjp26s1mDaTs07ebLQ05ZdAOICFWmQbHv3Hy43Gy7VfuzRCgQUw_kCNbfVsFexY0QfO4wuj6kOGrSy3UJXakGAadOvQJCM=s1600-w612",
      desc: "The iconic skyline and fast-paced lifestyle of the Big Apple."
    },
    {
      id: 3,
      title: "Tokyo, Japan",
      img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt0db69fde9a0f6d98/675e125faf051ba02b13ded4/japan-725347-Header_Desktop.jpg?fit=crop&disable=upscale&auto=webp&quality=60&crop=smart&width=1920&height=1080",
      desc: "A perfect blend of modern neon streets and traditional temples."
    }
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="relative z-10">
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 py-4 px-6 flex justify-between items-center shadow-lg">
          <h1 className="text-2xl font-bold text-white drop-shadow-xl tracking-wide">
            Catalog
          </h1>
          <nav className="flex gap-6 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/catalog" className="hover:text-blue-300">Catalog</Link>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/register" className="hover:text-blue-300">Register</Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-10">
          <h2 className="text-4xl font-bold text-white drop-shadow-2xl mb-8 text-center">
            All Travel Spots
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {places.map((place) => (
              <div
                key={place.id}
                className="group bg-white/20 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
              >
                <img
                  src={place.img}
                  alt={place.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-4 text-center text-white">
                  <h3 className="text-2xl font-semibold drop-shadow-[0_0_6px_#000000aa]">
                    {place.title}
                  </h3>
                  <p className="mt-2 text-sm opacity-90 drop-shadow-[0_0_6px_#000000aa] line-clamp-2">
                    {place.desc}
                  </p>

                  <Link
                    to={`/details/${place.id}`}
                    className="mt-4 inline-block bg-blue-500/30 border border-blue-300/40 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-500/40 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
