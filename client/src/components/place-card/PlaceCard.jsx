import { Link } from "react-router";

export default function PlaceCard({ place }) {
  return (
    <div
      key={place.id}
      className="group bg-white/20 backdrop-blur-lg border border-white/40 
                 rounded-2xl shadow-lg overflow-hidden transition-all 
                 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
    >
      <img
        src={place.imageUrl}
        alt={place.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-4 text-center text-white">
        <h3 className="text-2xl font-semibold drop-shadow-[0_0_6px_#000000aa]">
          {place.title}
        </h3>

        <p className="mt-2 text-sm opacity-90 drop-shadow-[0_0_6px_#000000aa] line-clamp-2">
          {place.description}
        </p>

        <Link
          to={`/details/${place.id}`}
          className="mt-4 inline-block bg-blue-500/30 border border-blue-300/40 
                     text-white px-5 py-2 rounded-lg shadow-lg 
                     hover:bg-blue-500/40 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
