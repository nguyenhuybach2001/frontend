import React from "react";
import s from "./product.module.scss";
import { useLocation } from "react-router-dom";

export default function ProductScreen() {
  const location = useLocation();

  // Parse query từ URL
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  return <div>ProductScreen</div>;
}
