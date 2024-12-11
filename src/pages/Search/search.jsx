import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiCaller from "../../api/apiCaller";
import { productApi } from "../../api/productApi";
import { Content, Header } from "antd/es/layout/layout";
import { Dropdown, Modal, Pagination, Tabs } from "antd";
import s from "./search.module.scss";
import { setSearchProduct } from "../../features/productSlice";
import { Link, useLocation } from "react-router-dom";
import { Line } from "@ant-design/charts";

export default function SearchScreen() {
  const searchProduct = useSelector((state) => state.product.searchProduct);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKey = queryParams.get("search");
  const [productDetail, setProductDetail] = useState({});
  const [productRelate, setProductRelate] = useState({});
  const [modal, setModal] = useState({ open: false, product_id: null });
  const [dataList, setDataList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoadingStates] = useState({
    page:true,
    content:true,
    priceHistory: true,
    relatedProducts: true,
  });
  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (searchKey) {
      dispatch(setSearchProduct({ keyword: searchKey }));
    }
  }, [searchKey]);
  const fetchListProduct = async (data) => {
    const response = await apiCaller({
      request: productApi.searchProducts(data),
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
    if (searchProduct.keyword) {
      fetchListProduct(searchProduct).then((res) => {
        setDataList(res.data);
      });
    }
  }, [searchProduct]);
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
  const itemSort2 = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            dispatch(
              setSearchProduct({
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
              setSearchProduct({
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
              setSearchProduct({
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
              setSearchProduct({
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
  const items1 = [
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
    <>
      <div>
        <Header
          style={{
            position: "sticky",
            top: "70px",
            zIndex: 99,
            gap: "20px",
            background: "white",
            display: "flex",
          }}
        >
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
        <h3 style={{ marginLeft: 50 }}>Từ khóa tìm kiếm {`"${searchKey}"`}</h3>
        {dataList?.items?.length > 0 ? (
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
            }}
          >
            <div
              style={{
                padding: 24,
                background: "white",
                borderRadius: "16px",
              }}
            >
              <div className={s.list}>
                {dataList?.items?.map((val, index) => (
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
              </div>
              <br />
              <br />
              <Pagination
                align="center"
                onChange={(e) => {
                  setPageCount(e);
                  dispatch(setSearchProduct({ page: e }));
                }}
                current={pageCount}
                defaultCurrent={1}
                total={dataList.total}
                pageSize={20}
                showSizeChanger={false}
              />
            </div>
          </Content>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            Từ khóa tìm không có
          </div>
        )}
      </div>
      <Modal
        width={700}
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, product_id: null });
        }}
        footer={false}
      >
        <h2 className={s.text_clamp1}>{productDetail.product_name}</h2>
        <Tabs defaultActiveKey="1" items={items1} />
      </Modal>
    </>
  );
}
