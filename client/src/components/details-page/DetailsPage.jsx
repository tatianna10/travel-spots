import { useParams, Link } from "react-router";

export default function DetailsPage() {
  const { id } = useParams();

  const places = [
    {
      id: "1",
      title: "Paris, France",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      longDesc:
        "Paris is known for its iconic Eiffel Tower, world-class museums like the Louvre, charming cafes, and beautiful riverside walks along the Seine. A perfect blend of history, art, and romance."
    },
    {
      id: "2",
      title: "New York, USA",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      longDesc:
        "New York City offers skyscrapers, Broadway shows, endless food options, Central Park, Times Square, and a culture of ambition and diversity unlike anywhere else."
    },
    {
      id: "3",
      title: "Tokyo, Japan",
      img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
      longDesc:
        "Tokyo is where futuristic skyscrapers meet ancient shrines. Explore vibrant districts like Shibuya and Akihabara, or walk quietly through serene gardens and centuries-old temples."
    }
  ];

  const place = places.find((p) => p.id === id);

  if (!place) {
    return (
      <div className="text-center text-white mt-24">
        <h1 className="text-3xl font-bold">Location Not Found</h1>
        <Link to="/" className="text-blue-300 underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center pt-12 px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="bg-white/20 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 max-w-3xl w-full text-white">
        <img
          src={place.img}
          alt={place.title}
          className="w-full h-72 object-cover rounded-xl shadow-lg"
        />

        <h1 className="text-4xl font-bold mt-6 drop-shadow-[0_0_10px_#000000aa] text-center">
          {place.title}
        </h1>

        <p className="mt-4 text-lg drop-shadow-[0_0_6px_#000000aa] leading-relaxed">
          {place.longDesc}
        </p>

        <div className="flex justify-center mt-8 gap-4">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-blue-500/30 border border-blue-300/40 rounded-lg hover:bg-blue-500/40 transition"
          >
            Back to Catalog
          </Link>

          <button className="px-6 py-3 bg-green-500/30 border border-green-300/40 rounded-lg hover:bg-green-500/40 transition">
            Like ⭐
          </button>

          <button className="px-6 py-3 bg-yellow-500/30 border border-yellow-300/40 rounded-lg hover:bg-yellow-500/40 transition">
            Add Comment 💬
          </button>
        </div>
      </div>
    </div>
  );
}
