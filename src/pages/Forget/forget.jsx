import { Button, Form, Input, message } from "antd";
import React from "react";
import s from "./forget.module.scss";
import apiCaller from "../../api/apiCaller";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Forget() {
  const navigate = useNavigate();
  const fetchForget = async (data) => {
    const response = await apiCaller({
      request: authApi.forget(data),
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
    const data = {
      email: values.email,
    };
    fetchForget(data).then((res) => {
      message.success("ịij");
    });
  };

  return (
    <div className={s.body}>
      <Form onFinish={onFinish} className={s.form} layout="vertical">
        <h1>Forget Password</h1>
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

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <h3
          style={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Sign in
        </h3>
      </Form>
    </div>
  );
}
