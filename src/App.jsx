import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
