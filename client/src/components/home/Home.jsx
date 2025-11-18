import Header from "../header/Header.jsx";
import HomeMain from "./HomeMain.jsx";
import Footer from "../footer/Footer.jsx";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-content">
        <Header />
        <HomeMain />
        <Footer />
      </div>
    </div>
  );
}
