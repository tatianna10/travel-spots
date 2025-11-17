export default function Footer() {
  return (
    <footer className="bg-white/20 backdrop-blur-md border-t border-white/30 text-center py-4 mt-auto rounded-t-xl shadow-lg text-white">
      <p className="text-white text-sm drop-shadow-2xl">
        © {new Date().getFullYear()} Travel Spots — All rights reserved.
      </p>
    </footer>
  );
}
