import React, { useEffect, useState } from "react";
import s from "./home.module.scss";
import { Carousel, Modal, Tabs } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { Line } from "@ant-design/charts";

function Home() {
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState({});
  const [productRelate, setProductRelate] = useState({});
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [modal, setModal] = useState({ open: false, product_id: null });
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
  const fetchProductDetail = async (data) => {
    const response = await apiCaller({
      request: productApi.productDetail(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchProductRelate = async (data) => {
    const response = await apiCaller({
      request: productApi.relateProduct(data),
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
    fetchTopDiscounts({ category_id: "s94" }).then((res) =>
      setData1(res.data.products)
    );
  }, []);
  useEffect(() => {
    if (modal.product_id != null) {
      fetchProductDetail({ product_id: modal.product_id }).then((res) => {
        setProductDetail(res.data);
        console.log(res.data);
      });
      fetchProductRelate({ product_id: modal.product_id }).then((res) => {
        setProductRelate(res.data);
        console.log(res);
      });
    }
  }, [modal]);
  const data = productDetail?.history
    ?.map((item) => ({
      Ngày: item.updated_date,
      Giá: item.price,
    }))
    .sort((a, b) => new Date(a.Ngày) - new Date(b.Ngày));
  const config = {
    data,
    height: 300,
    xField: "Ngày",
    yField: "Giá",
    axis: {
      x: { title: "Ngày" },
      y: { title: "Giá" },
    },
  };
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Lịch sử giá",
      children: <Line {...config} />,
    },
    {
      key: "2",
      label: "Sản phẩm liên quan",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div className={s.wrapper}>
      <div className={s.body}>
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
      </div>
      <h2>Thời trang nam</h2>
      <Carousel
        autoplay={modal.open !== true ? true : false}
        autoplaySpeed={1500}
        slidesToShow={3}
        infinite={true}
        centerMode={true}
        dots={false}
        draggable={true}
      >
        {data1.map((val, index) => (
          <div
            key={index}
            className={s.image}
            onClick={(e) => {
              e.stopPropagation();
              setModal({
                open: true,
                product_id: val.product_id,
              });
            }}
          >
            <img
              style={{ borderRadius: "10px 10px 0 0" }}
              src={val.image_url}
              alt="image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/imgFallBack.png";
              }}
            />
            <hr style={{ width: "100%", color: "black", marginTop: "0" }} />
            <div>
              <p className={s.text_clamp}>{val.product_name}</p>
              <div className={s.content1}>
                <p
                  style={{
                    textDecoration: "line-through",
                    color: "#828282",
                    fontWeight: 600,
                  }}
                >
                  {val.origin_price.toLocaleString("vi-VN")}VNĐ
                </p>
                <p
                  style={{
                    color: "red",
                    fontWeight: 700,
                  }}
                >
                  {val.price.toLocaleString("vi-VN")}VNĐ
                </p>
              </div>
              <div className={s.content1}>
                <p>
                  Đã bán {val.all_time_quantity_sold.toLocaleString("vi-VN")}
                </p>
                <p
                  style={{
                    display: "flex",
                    gap: "3px",
                    flexDirection: "row-reverse",
                  }}
                >
                  <img src="/star.svg" alt="star" />
                  {val.rating_average}
                </p>
              </div>
              <p className={s.discount}>-{val.discount_rate}%</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10,1fr)",
                }}
              >
                <Link
                  target="_blank"
                  className={s.btn}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  to={val.url_path}
                >
                  Tới nơi bán
                </Link>
                {val.category_id.includes("s") ? (
                  <img
                    style={{
                      gridColumn: "span 3",
                      width: "100%",
                      borderRadius: "0 0 10px 0",
                    }}
                    alt="tiki"
                    src="/sendo.svg"
                  />
                ) : (
                  <img
                    style={{
                      gridColumn: "span 3",
                      width: "100%",
                      borderRadius: "0 0 10px 0",
                    }}
                    alt="tiki"
                    src="/tiki.svg"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <Modal
        width={700}
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, product_id: null });
        }}
        footer={false}
      >
        <h2 className={s.text_clamp1}>{productDetail.product_name}</h2>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </div>
  );
}

export default Home;
