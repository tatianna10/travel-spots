import { Route, Routes } from "react-router";
import HomePage from "./components/HomePage.jsx";
import DetailsPage from "./components/DetailsPage.jsx";



function App() {
  return (
    <>
      <Routes>
        < Route path="/" element={<HomePage />} />
        < Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </>
  );
}

export default App;





