import React, { useEffect, useState } from "react";
import s from "./product.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Carousel,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Pagination,
  Tabs,
  theme,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import apiCaller from "../../api/apiCaller";
import { productApi } from "../../api/productApi";
import { setSortProduct } from "../../features/productSlice";
import { Line } from "react-chartjs-2";
const { Header, Content, Footer, Sider } = Layout;
export default function ProductScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageCount, setPageCount] = useState(1);
  const queryParams = new URLSearchParams(location.search);
  const category_id = queryParams.get("category_id");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingModal, setLoadingModal] = useState(true);
  const [productDetail, setProductDetail] = useState({});
  const [productRelate, setProductRelate] = useState([]);
  const [modal, setModal] = useState({ open: false, product_id: null });
  const [dataList, setDataList] = useState([]);
  const siderStyle = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    paddingTop: "70px",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  };
  const sortProduct = useSelector((state) => state.product.sortProduct);
  const list1 = useSelector((state) => state.product.list1);
  const list2 = useSelector((state) => state.product.list2);
  const items = (category_id.includes("t") ? list1 : list2).map(
    (item, index) => ({
      key: item.category_id.toString(),
      label: item.category_name,
    })
  );
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
  const dataDetail = {
    labels: productDetail?.history?.map((val) => val.updated_date),
    datasets: [
      {
        label: "",
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
        display: false,
        text: "Lịch sử giá",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày", 
          font: {
            size: 16,
            weight: "bold",
            family: "Arial",
          },
          color: "#555555", 
        },
        ticks: {
          callback: function (value, index, ticks) {
            const dateLabel = dataDetail.labels[index];
            if (index === 0 || index % 3 === 0) {
              return dateLabel;
            }
            return "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Giá (Đồng)", 
          font: {
            size: 16,
            weight: "bold",
            family: "Arial",
          },
          color: "#555555", 
        },
      },
    },
  };
  const items1 = [
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const fetchListProduct = async (data) => {
    const response = await apiCaller({
      request: productApi.listProducts(data),
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
        console.log("Failed to fetch top discounts:", error);
        setProductRelate([]);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };

  useEffect(() => {
    if (category_id) {
      dispatch(setSortProduct({ category_id: category_id }));
    }
  }, [category_id]);
  useEffect(() => {
    setLoadingPage(true);
    if (sortProduct.category_id) {
      fetchListProduct(sortProduct).then((res) => {
        setDataList(res.data);
      });
    }
  }, [sortProduct]);

  useEffect(() => {
    setLoadingModal(true);
    if (modal.product_id != null) {
      fetchProductDetail({ product_id: modal.product_id }).then((res) => {
        setProductDetail(res.data);
      });
      fetchProductRelate({ product_id: modal.product_id }).then((res) => {
        setProductRelate(res.data);
      });
    }
  }, [modal]);
  const onClick = (e) => {
    navigate(`/products?category_id=${e.key}`);
    dispatch(setSortProduct({ category_id: e.key }));
  };
  const itemSort2 = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            dispatch(
              setSortProduct({
                sort_by: "all_time_quantity_sold",
                order_by: "asc",
              })
            );
          }}
          style={{ margin: "0" }}
        >
          Tăng dần
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          onClick={() => {
            dispatch(
              setSortProduct({
                sort_by: "all_time_quantity_sold",
                order_by: "desc",
              })
            );
          }}
          style={{ margin: "0" }}
        >
          Giảm dần
        </p>
      ),
    },
  ];
  const itemSort1 = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            dispatch(
              setSortProduct({
                sort_by: "price",
                order_by: "asc",
              })
            );
          }}
          style={{ margin: "0" }}
        >
          Tăng dần
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          onClick={() => {
            dispatch(
              setSortProduct({
                sort_by: "price",
                order_by: "desc",
              })
            );
          }}
          style={{ margin: "0" }}
        >
          Giảm dần
        </p>
      ),
    },
  ];

  return (
    <>
      <Layout hasSider>
        <Sider style={siderStyle
        }>
          <div className="demo-logo-vertical" />
          <Menu
            
            mode="inline"
            selectedKeys={[sortProduct.category_id]}
            items={items}
            style={{
              backgroundColor: sortProduct.category_id.includes("s")
                ? "rgb(255 255 255)" // Màu nền menu cho Sendo
                : "rgb(255 255 255)", // Màu nền menu cho Tiki
            }}
            onClick={onClick}
          />
        </Sider>
        <Layout
          style={{
            marginInlineStart: 302,
          }}
        >
          <Header
            style={{
              position: "sticky",
              top: "70px",
              zIndex: 99,
              gap: "20px",
              background: colorBgContainer,
              display: "flex",
            }}
          >
            <div style={{ width: "150px" }}>
              {sortProduct.category_id.includes("s") ? (
                <img
                  style={{
                    gridColumn: "span 3",
                    height: "100%",
                    borderRadius: "0 0 10px 0",
                  }}
                  alt="sendo"
                  src="/sendo.svg"
                />
              ) : (
                <img
                  style={{
                    gridColumn: "span 3",
                    height: "100%",
                    borderRadius: "0 0 10px 0",
                  }}
                  alt="tiki"
                  src="/tiki.svg"
                />
              )}
            </div>
            <Dropdown
              overlayClassName={s.dropdown}
              menu={{ items: itemSort1 }}
              trigger={"click"}
            >
              <p style={{ margin: "0", fontWeight: 700, cursor: "pointer" }}>
                Theo giá
              </p>
            </Dropdown>
            <Dropdown
              overlayClassName={s.dropdown}
              menu={{ items: itemSort2 }}
              trigger={"click"}
            >
              <p style={{ margin: "0", fontWeight: 700, cursor: "pointer" }}>
                Đã bán
              </p>
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",

            }}
          >
            {loadingPage ? (
              <Flex
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
            </Flex>
            ) : (
              <div
                style={{
                  padding: 24,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <div className={s.list}>
                  {dataList?.items.map((val, index) => (
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
                      <hr
                        style={{
                          width: "100%",
                          color: "black",
                          marginTop: "0",
                        }}
                      />
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
                            {val.origin_price?.toLocaleString("vi-VN")}VNĐ
                          </p>
                          <p
                            style={{
                              color: "red",
                              fontWeight: 700,
                            }}
                          >
                            {val.price?.toLocaleString("vi-VN")}VNĐ
                          </p>
                        </div>
                        <div className={s.content1}>
                          <p>
                            Đã bán{" "}
                            {val.all_time_quantity_sold?.toLocaleString(
                              "vi-VN"
                            )}
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
                </div>
                <br />
                <br />
                <Pagination
                  align="center"
                  onChange={(e) => {
                    setPageCount(e);
                    dispatch(setSortProduct({ page: e }));
                  }}
                  current={pageCount}
                  defaultCurrent={1}
                  total={dataList.total}
                  pageSize={20}
                  showSizeChanger={false}
                />
              </div>
            )}
          </Content>
        </Layout>
      </Layout >
      <Modal
        width={1200}
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, product_id: null });
        }}
        footer={false}
      >
        {loadingModal ? (
          <Flex
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
        </Flex>
        ) : (
          <>
            <h2 className={s.text_clamp1}>{productDetail.product_name}</h2>
            <Tabs defaultActiveKey="1" items={items1} />
          </>
        )}
      </Modal>
    </>
  );
}
