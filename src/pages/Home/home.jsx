import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../features/counterSlice";
import s from "./home.module.scss";
import { Carousel } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";
import axios from "axios";
import { authApi } from "../../api/authApi";

function Home() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const fetchTopDiscounts = async (data) => {
    const response = await apiCaller({
      request: homeApi.top_discount(data),
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
    fetchTopDiscounts({ category_id: "s1722" }).then((res) =>
      setData1(res.data.products)
    );
  }, []);
  console.log(data1, "uhij");
  return (
    <div className={s.wrapper}>
      <div className={s.body}>
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
      </div>
      <h2>Thời trang nam</h2>
      <Carousel autoplay autoplaySpeed={1500} slidesToShow={3}>
        {data1.map((val, index) => (
          <div key={index} className={s.image}>
            <img src={val.image_url} alt="image" />
          </div>
        ))}
      </Carousel>
      <h2>Thời trang nam</h2>
      <Carousel autoplay autoplaySpeed={1500} slidesToShow={3}>
        {data1.map((val, index) => (
          <div key={index} className={s.image}>
            <img src={val.image_url} alt="image" />
          </div>
        ))}
      </Carousel>
      <h2>Thời trang nam</h2>
      <Carousel autoplay autoplaySpeed={1500} slidesToShow={3}>
        {data1.map((val, index) => (
          <div key={index} className={s.image}>
            <img src={val.image_url} alt="image" />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Home;
