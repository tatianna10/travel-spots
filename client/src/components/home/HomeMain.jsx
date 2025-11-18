import { Link } from "react-router";

export default function HomeMain() {
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
      img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt0db69fde9a0f6d98/675e125faf051ba02b13ded4/japan-725347-Header_Desktop.jpg",
      desc: "A perfect blend of modern neon streets and traditional temples."
    }
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <section className="relative">
        <div className="absolute inset-0 bg-black/30 rounded-xl z-0"></div>

        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-2xl">
          Explore Places
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 relative z-10">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-md hover:scale-105 transition transform hover:shadow-blue-500/40"
            >
              <img
                src={place.img}
                alt={place.title}
                className="h-48 w-full object-cover rounded-lg"
              />

              <h3 className="text-xl font-bold mt-3 text-center text-white">
                {place.title}
              </h3>

              <p className="text-white mt-1 text-center px-4">
                {place.desc}
              </p>

              {/* Restored View Details Button */}
              <Link
                to={`/details/${place.id}`}
                className="mt-4 mb-4 mx-auto block bg-blue-500/20 backdrop-blur-md border border-blue-300/40 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500/30 transition-colors duration-300 hover:shadow-xl w-40 text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
