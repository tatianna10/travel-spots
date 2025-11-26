import { Routes, Route } from "react-router";
import Home from "./components/home/Home";
import Catalog from "./components/catalog/Catalog";
import DetailsPage from "./components/details-page/DetailsPage";
import CreatePlace from "./components/create-place/CreatePlace";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import PrivateRoute from "./guards/PrivateRoute";
import GuestRoute from "./guards/GuestRoute";
import EditPlace from "./components/edit-page/EditPlace.jsx";


function App() {
  return (

    <Routes>

      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/places" element={<Catalog />} />
      <Route path="/places/:id/details" element={<DetailsPage />} />

      {/* gues-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/places/create" element={<CreatePlace />} />
        <Route path="/places/:id/edit" element={<EditPlace />} />
      </Route>

    </Routes>

  );
}

export default App;
