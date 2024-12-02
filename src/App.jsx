import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import MainLayout from "./components/MainLayout/mainLayout";
import SignUp from "./pages/SignUp/signUp";
import Verify from "./pages/Verify/verify";
import Forget from "./pages/Forget/forget";
import ResetPass from "./pages/ResetPass/resetPess";
import ProductScreen from "./pages/Products/product";
import AnalysisScreen from "./pages/Analysis/analysis";
import SearchScreen from "./pages/Search/search";
import TrackingShop from "./pages/TrangkingShop";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductScreen />} />
          <Route path="/analysis" element={<AnalysisScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/tracking-shop" element={<TrackingShop />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/reset-password" element={<ResetPass />} />
      </Routes>
    </Router>
  );
}

export default App;
