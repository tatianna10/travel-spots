import { Routes, Route } from "react-router";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog";
import DetailsPage from "./components/details-page/DetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/places" element={<Catalog />} />
      <Route path="/places/:id/details" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
