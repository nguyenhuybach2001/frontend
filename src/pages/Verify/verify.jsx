import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import s from "./verify.module.scss";
import apiCaller from "../../api/apiCaller";
import { authApi } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const fetchVerify = async (data) => {
    const response = await apiCaller({
      request: authApi.verify(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  useEffect(() => {
    const data = {
      token: token,
      email: email,
    };
    fetchVerify(data).then((res) => {
      message.success(res.data.message);
      setLoading(false);
    });
  }, []);
  return (
    <div className={s.body}>
      <div className={s.form}>
        {loading ? (
          <p>loadingg</p>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
