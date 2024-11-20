import { Button, Form, Input } from "antd";
import React from "react";
import s from "./login.module.scss";

export default function Login() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className={s.body}>
      <Form onFinish={onFinish} className={s.form} layout="vertical">
        <h1>Login</h1>
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
          <p>Forget password</p>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <h3 style={{ textAlign: "center" }}>Sign Up</h3>
      </Form>
    </div>
  );
}
