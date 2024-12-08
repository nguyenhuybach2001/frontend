import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import s from "./signUp.module.scss";
import apiCaller from "../../api/apiCaller";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const fetchSignUp = async (data) => {
    const response = await apiCaller({
      request: authApi.signup(data),
      errorHandler: (error) => {
        message.error(error.response.data.detail);
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
      name: values.username,
      email: values.email,
      password: values.password,
    };
    fetchSignUp(data).then((res) => {
      console.log(res);
      setStep(1);
    });
  };

  return (
    <div className={s.body}>
      {step === 0 ? (
        <Form onFinish={onFinish} className={s.form} layout="vertical">
          <h1>Sign Up</h1>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
                message: "Vui lòng nhập mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.length < 8) {
                    return Promise.reject("Mật khẩu phải có ít nhất 8 ký tự!");
                  }
                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất 1 ký tự in hoa!"
                    );
                  }
                  if (!/[0-9]/.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất 1 chữ số!"
                    );
                  }
                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <p style={{ color: "#828282", fontSize: "14px" }}>
            <i>kasdads</i>
          </p>
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
      ) : (
        <div className={s.form}>jiijijijij</div>
      )}
    </div>
  );
}
