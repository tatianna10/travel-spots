export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')" }}>
      {/* Header */}
      <div className="relative z-10">
     
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
        <footer className="bg-white/20 backdrop-blur-md border-t border-white/30 text-center py-4 mt-39 rounded-t-xl shadow-lg text-white">
          <p className="text-white text-sm drop-shadow-2xl">
            © {new Date().getFullYear()} Travel Spots — All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}