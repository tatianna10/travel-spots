import Footer from "../footer/Footer.jsx";
import Header from "../header/Header.jsx";
import HomeMain from "./HomeMain.jsx";


export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Everything is inside the same wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <HomeMain />
        <Footer />
      </div>
    </div>
  );
}
