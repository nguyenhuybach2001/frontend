import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import s from "./navbar.module.scss";
import { Button, Dropdown, Form, Input, Menu, message, Modal } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";
import { authApi } from "../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setList1,
  setList2,
  setSearchProduct,
  setSortProduct,
} from "../../features/productSlice";
import { SearchOutlined } from "@ant-design/icons";

function Navbar() {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const list1 = useSelector((state) => state.product.list1);
  const list2 = useSelector((state) => state.product.list2);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const fetchTopDiscounts = async (data) => {
    const response = await apiCaller({
      request: homeApi.list_category(data), // Truyền hàm request được định nghĩa
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchUser = async (data) => {
    const response = await apiCaller({
      request: authApi.user(data),
      errorHandler: (error) => {
        const access_token = localStorage.getItem("access_token");
        access_token &&
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        console.log("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchChangePass = async (data) => {
    const response = await apiCaller({
      request: authApi.changePass(data),
      errorHandler: (error) => {
        if (error.status == 400) {
          message.error(error?.response?.data?.detail);
        }
        console.log("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };

  useEffect(() => {
    const data = { token: localStorage.getItem("access_token") };
    fetchUser(data).then((res) => {
      setUser(res.data);
    });
    fetchTopDiscounts({ platform: "t" }).then((res) =>
      dispatch(setList1(res.data))
    );
    fetchTopDiscounts({ platform: "s" }).then((res) =>
      dispatch(setList2(res.data))
    );
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const item1 = list1.map((item, index) => ({
    key: item.category_id,
    label: (
      <p
        style={{ margin: "0" }}
        onClick={() => {
          navigate(`/products?category_id=${item.category_id}`);
          dispatch(setSortProduct({ category_id: item.category_id }));
        }}
      >
        {item.category_name}
      </p>
    ),
  }));
  const item2 = list2.map((item, index) => ({
    key: item.category_id,
    label: (
      <p
        style={{ margin: "0" }}
        onClick={() => {
          navigate(`/products?category_id=${item.category_id}`);
        }}
      >
        {item.category_name}
      </p>
    ),
  }));
  const item3 = [
    {
      key: "1",
      label: (
        <p
          style={{ margin: "0" }}
          onClick={() => {
            user
              ? navigate(`/tracking-shop`)
              : message.info("Vui lòng đăng nhập để xem");
          }}
        >
          Theo dõi shop
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          style={{ margin: "0" }}
          onClick={() => {
            user
              ? navigate(`/tracking-product`)
              : message.info("Vui lòng đăng nhập để xem");
          }}
        >
          Theo dõi sản phẩm
        </p>
      ),
    },
  ];
  const items = [
    {
      key: "1",
      label: (
        <p
          style={{ margin: "0" }}
          onClick={() => {
            setOpenModal1(true);
          }}
        >
          Đổi mật khẩu
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          style={{ margin: "0" }}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Log out
        </p>
      ),
    },
  ];
  const onFinish = (values) => {
    dispatch(setSearchProduct({ keyword: values.search }));
    navigate(`/search?search=${values.search}`);
    setOpenModal(false);
    form.resetFields();
  };
  const onUpdate = (val) => {
    const data = {
      old_password: val.old_password,
      new_password: val.confirm,
    };
    fetchChangePass(data).then((res) => {
      console.log(res, "kokok");
      if (res.status == 200) {
        setOpenModal1(false);
        message.success("Đổi mật khẩu thành công");
        form1.resetFields();
      }
    });
  };
  return (
    <>
      <div className={s.wrapper + " " + (isVisible && s.scroll)}>
        <div className={s.body}>
          <div className={s.links}>
            <Link to="/">
              <h1>eData Insight</h1>
            </Link>
            <Link to="/">
              <p>Trang chủ</p>
            </Link>
            <Dropdown overlayClassName={s.dropdown} menu={{ items: item1 }}>
              <p style={{ cursor: "default" }}>Tiki</p>
            </Dropdown>
            <Dropdown overlayClassName={s.dropdown} menu={{ items: item2 }}>
              <p style={{ cursor: "default" }}>Sendo</p>
            </Dropdown>
            <div
              onClick={() => {
                user
                  ? navigate("/analysis")
                  : message.info("Vui lòng đăng nhập để xem");
              }}
              style={{ cursor: "pointer" }}
            >
              <p>Phân tích</p>
            </div>
            <Dropdown overlayClassName={s.dropdown} menu={{ items: item3 }}>
              <p style={{ cursor: "default" }}>Phân tích chuyên sâu</p>
            </Dropdown>
          </div>
          <SearchOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpenModal(true);
            }}
          />
          <div>
            {user ? (
              <Dropdown overlayClassName={s.dropdown} menu={{ items }}>
                <p style={{ cursor: "default" }}>{user.name}</p>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        footer={false}
      >
        <h2>Tìm kiếm sản phẩm</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="search"
            rules={[
              {
                required: true,
                message: "Vui lòng điền từ khóa!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={350}
        title={"Đổi mật khẩu"}
        open={openModal1}
        footer={false}
      >
        <Form onFinish={onUpdate} layout="vertical" form={form1}>
          <Form.Item
            name="old_password"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Please input your old password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
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

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["new_password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              B
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Navbar;
