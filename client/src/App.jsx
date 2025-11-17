import { Routes, Route } from "react-router";
import Home from "./components/home/Home";
import DetailsPage from "./components/details-page/DetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details/:id/details" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
