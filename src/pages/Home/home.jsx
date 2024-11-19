import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../features/counterSlice";
import s from "./home.module.scss";
import { Carousel } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";

function Home() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  const API_URL = import.meta.env.VITE_API_URL;
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  const fetchTopDiscounts = async (data) => {
    const response = await apiCaller({
      request: homeApi.top_discount(data), // Truyền hàm request được định nghĩa
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      console.log("Top Discounts:", response);
      return response; // Xử lý thêm hoặc trả về dữ liệu
    }

    return null; // Nếu có lỗi, trả về null
  };
  useEffect(() => {
    console.log(fetchTopDiscounts({ category: "Thời trang Nam" }));
  }, []);
  return (
    <div className={s.wrapper}>
      <div className={s.body}>
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
      </div>
      <h2>Thời trang nam</h2>
      <Carousel arrows afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      <h2>Thời trang nam</h2>
      <Carousel arrows afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      <h2>Thời trang nam</h2>
      <Carousel arrows afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      <h2>Thời trang nam</h2>
      <Carousel arrows afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </div>
  );
}

export default Home;
