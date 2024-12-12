import React, { useEffect, useState } from "react";
import s from "./home.module.scss";
import { Carousel, Modal, Tabs, Tooltip } from "antd";
import apiCaller from "../../api/apiCaller";
import { homeApi } from "../../api/homeApi";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { Line } from "react-chartjs-2";
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

function Home() {
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState({});
  const [productRelate, setProductRelate] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingModal, setLoadingModal] = useState(true);
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
      setLoadingPage(false);
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
      setLoadingModal(false);
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
    setLoadingPage(true);
    fetchTopDiscounts({ category_id: "s94" }).then((res) =>
      setData1(res.data.products)
    );
  }, []);
  useEffect(() => {
    setLoadingModal(true)
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

  const dataDetail = {
    labels: productDetail?.history?.map((val) => val.updated_date),
    datasets: [
      {
        label: "Dataset 1",
        data: productDetail?.history?.map((val) => val.price),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            const dateLabel = dataDetail.labels[index];
            if (index === 0 || index % 5 === 0) {
              return dateLabel;
            }
            return "";
          },
        },
      },
    },
  };
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Lịch sử giá",
      children: <Line options={options} data={dataDetail} />,
    },
    {
      key: "2",
      label: "Sản phẩm liên quan",
      children:
        productRelate.length > 0 ? (
          <Carousel
            slidesToShow={3}
            infinite={true}
            arrows
            dots={false}
            draggable={true}
            lo
          >
            {productRelate?.map((val, index) => (
              <div
                key={index}
                className={s.image}
                style={{ cursor: "default", maxWidth: "200px" }}
              >
                <img
                  style={{ borderRadius: "10px 10px 0 0" }}
                  src={val.image_url}
                  alt="image"
                />
                <hr
                  style={{
                    width: "100%",
                    color: "black",
                    marginTop: "0",
                  }}
                />
                <div>
                  <Tooltip title={val.product_name}>
                    <p className={s.text_clamp}>{val.product_name}</p>
                  </Tooltip>
                  <div className={s.content1}>
                    <p
                      style={{
                        textDecoration: "line-through",
                        color: "#828282",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {val.origin_price?.toLocaleString("vi-VN")}VNĐ
                    </p>
                    <p
                      style={{
                        color: "red",
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {val.price?.toLocaleString("vi-VN")}VNĐ
                    </p>
                  </div>
                  <div className={s.content2}>
                    <p>
                      Đã bán{" "}
                      {val.all_time_quantity_sold?.toLocaleString("vi-VN")}
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
        ) : (
          <div>Không có sản phẩm liên quan</div>
        ),
    },
  ];

  return (
    <div className={s.wrapper}>
      <div className={s.body}>
        <h1>Nền tảng số liệu thương mại điện tử</h1>
        <p>Cung cấp số liệu chi tiết về xu hướng thị trường và hiệu suất sản phẩm trên các sàn thương mại điện tử,
          giúp tối ưu hóa chiến lược kinh doanh của bạn.</p>
      </div>
      {loadingPage ? (<Flex
        align="center"
        justify="center"
        style={{
          height: "100%",
          padding: "24px",
        }}
      >
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
                color: "#1890ff",
              }}
              spin
            />
          }
        />
      </Flex>) : (<>
        <h2>Thời trang nam</h2>
        <Carousel
          autoplay={modal.open !== true ? true : false}
          autoplaySpeed={1500}
          slidesToShow={5}
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
        </Carousel></>)}

      <Modal
        width={700}
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, product_id: null });
        }}
        footer={false}
      >
        {loadingModal ? (<Flex
          align="center"
          justify="center"
          style={{
            height: "100%",
            padding: "24px",
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 48,
                  color: "#1890ff",
                }}
                spin
              />
            }
          />
        </Flex>) :
          (<><h2 className={s.text_clamp1}>{productDetail.product_name}</h2>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} /></>)}

      </Modal>
    </div>
  );
}

export default Home;
