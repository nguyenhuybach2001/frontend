import React, { useEffect, useState } from "react";
import apiCaller from "../../api/apiCaller";
import { Content, Header } from "antd/es/layout/layout";
import { Dropdown, Modal, Pagination, Tabs } from "antd";
import s from "./shop.module.scss";
import { Link, useLocation } from "react-router-dom";
import { trackingApi } from "../../api/trackingApi";

export default function ShopScreen() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shopId = queryParams.get("shop_id");
  const [dataList, setDataList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [sort, setSort] = useState({
    sort_by: "all_time_quantity_sold",
    order_by: "desc",
  });
  const fetchListProductShop = async (data) => {
    const response = await apiCaller({
      request: trackingApi.products_shop(data),
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
    const data = {
      token: localStorage.getItem("access_token"),
      data: {
        shop_id: shopId,
        page: pageCount,
        size: 20,
        sort_by: sort.sort_by,
        order_by: sort.order_by,
      },
    };
    if (shopId) {
      fetchListProductShop(data).then((res) => {
        setDataList(res.data);
      });
    }
  }, [shopId, sort, pageCount]);
  const itemSort2 = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            setSort({ sort_by: "all_time_quantity_sold", order_by: "asc" });
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
            setSort({
              sort_by: "all_time_quantity_sold",
              order_by: "desc",
            });
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
            setSort({
              sort_by: "price",
              order_by: "asc",
            });
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
            setSort({
              sort_by: "price",
              order_by: "desc",
            });
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
        {dataList?.length > 0 ? (
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
                {dataList?.map((val, index) => (
                  <div
                    key={index}
                    className={s.image}
                    onClick={(e) => {
                      e.stopPropagation();
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
            Không có sản phẩm
          </div>
        )}
      </div>
    </>
  );
}
