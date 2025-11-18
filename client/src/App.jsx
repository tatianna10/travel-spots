import { Routes, Route } from "react-router";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/places" element={<Catalog />} />
    </Routes>
  );
}

export default App;
