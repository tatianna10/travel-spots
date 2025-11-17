import { Route, Routes } from "react-router";
import Home from "./components/home/Home.jsx";
import DetailsPage from "./components/details-page/DetailsPage.jsx";

function App() {
  return (
    <>

      <Routes>
        < Route path="/" element={<Home />} />
        < Route path="/details/:id/details" element={<DetailsPage />} />
      </Routes>
    </>
  );
}

export default App;





