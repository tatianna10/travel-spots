import { Routes, Route } from "react-router";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog.jsx";
import DetailsPage from "./components/details-page/DetailsPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Catalog />} />
        <Route path="/places/:id/details" element={<DetailsPage />} />
        {/* TODO later:
      <Route path="/create/spot" element={<CreateSpot />} />
      */}
      </Routes>
    </>
  );
}

export default App;
