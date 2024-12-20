import { Button, Form, Input } from "antd";
import React from "react";
import s from "./login.module.scss";
import apiCaller from "../../api/apiCaller";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const fetchLogin = async (data) => {
    const response = await apiCaller({
      request: authApi.login(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };

  const onFinish = (values) => {
    const formData = new URLSearchParams();
    formData.append("username", values.email);
    formData.append("password", values.password);

    fetchLogin(formData).then((res) => {
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/");
    });
  };

  return (
    <div className={s.body}>
      <Form onFinish={onFinish} className={s.form} layout="vertical">
        <h1>Login</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "The input is not a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <p onClick={() => navigate("/forget")} style={{ cursor: "pointer" }}>
            Forget password
          </p>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <h3
          style={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/sign-up")}
        >
          Sign Up
        </h3>
      </Form>
    </div>
  );
}
