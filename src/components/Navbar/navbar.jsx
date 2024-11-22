import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import s from "./navbar.module.scss";
import { Dropdown, Menu, Modal } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";
import { authApi } from "../../api/authApi";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
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
        console.error("Failed to fetch top discounts:", error);
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
    fetchTopDiscounts({ platform: "t" }).then((res) => setList1(res.data));
    fetchTopDiscounts({ platform: "s" }).then((res) => setList2(res.data));
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
    key: `list1-${index + 1}`,
    label: item.category_name,
  }));
  const item2 = list2.map((item, index) => ({
    key: `list2-${index + 1}`,
    label: item.category_name,
  }));
  const items = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            localStorage.clear();
            navigate(0);
          }}
        >
          Log out
        </p>
      ),
    },
  ];
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
            <Link to="#">
              <p>Phân tích</p>
            </Link>
            <Link to="#">
              <p>Phân tích chuyên sâu</p>
            </Link>
          </div>
          <div>
            {user ? (
              <Dropdown overlayClassName={s.dropdown} menu={{ items }}>
                <p style={{ cursor: "default" }}>{user.name}</p>
              </Dropdown>
            ) : (
              <Link to="/login">
                <button>Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
