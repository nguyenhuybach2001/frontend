import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import s from "./resetPass.module.scss";
import apiCaller from "../../api/apiCaller";
import { authApi } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

export default function ResetPass() {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  const fetchReset = async (data) => {
    const response = await apiCaller({
      request: authApi.resetPass(data),
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
    if (email) {
      form.setFieldsValue({
        email: email,
      });
    }
  }, []);
  const onFinish = (values) => {
    const data = {
      token: token,
      email: email,
      password: values.password,
    };
    fetchReset(data).then((res) => {
      console.log("ộhjkkol");
    });
  };

  return (
    <div className={s.body}>
      <Form
        onFinish={onFinish}
        form={form}
        className={s.form}
        layout="vertical"
      >
        <h1>Login</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
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
