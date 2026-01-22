import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import HomeMain from "./HomeMain.jsx";

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-inner">
        <Header showBrand={true} />
        <HomeMain />
        <Footer />
      </div>
    </div>
  );
}
