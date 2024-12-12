import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import apiCaller from "../../api/apiCaller";
import { trackingApi } from "../../api/trackingApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import { Tooltip as Tooltip1 } from "antd";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function TrackingProduct() {
  const navigate = useNavigate();
  const [dataProduct, setDataProduct] = useState([]);
  const [dataProductDetail, setDataProductDetail] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("t");
  const [radioDate, setRadioDate] = useState(7);
  const [loading, setLoading] = useState(false);
  const [dataSuccess, setDataSuccess] = useState({});
  const [openModal, setOpenModal] = useState({ open: false, id: null });
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [value, setValue] = useState(7);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const fetchProductData = async () => {
    const response = await apiCaller({
      request: trackingApi.dataProduct(),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchAddProduct = async (data) => {
    const response = await apiCaller({
      request: trackingApi.add_product(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchCheckProduct = async (data) => {
    const response = await apiCaller({
      request: trackingApi.check_product(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchExtend = async (data) => {
    const response = await apiCaller({
      request: trackingApi.extendDateProduct(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      fetchProductData(data).then((res) => {
        setDataProduct(res.data.tracked_products);
      });
      return response;
    }

    return null;
  };
  const fetchProductDetail = async (data) => {
    const response = await apiCaller({
      request: trackingApi.detail_product(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      fetchProductData(data).then((res) => {
        setDataProduct(res.data.tracked_products);
      });
      return response;
    }

    return null;
  };
  useEffect(() => {
    const data = {
      token: localStorage.getItem("access_token"),
      product_id: selectedRow?.platform,
    };
    selectedRow &&
      fetchProductDetail(data).then((res) => {
        setDataProductDetail(res.data?.revenue_data);
        console.log(res.data?.revenue_data);
      });
  }, [selectedRow]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const data = { token: token };
    fetchProductData().then((res) => {
      setDataProduct(res.data?.tracked_products);
    });
  }, []);
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <img style={{ width: 50 }} src={text} />,
    },
    {
      title: "Nền tảng",
      dataIndex: "platform",
      key: "platform",
      render: (text) => <p>{text.includes("t") ? "Tiki" : "Sendo"}</p>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip1 title={text}>
          <p className={s.text_clamp}>{text}</p>
        </Tooltip1>
      ),
    },
    {
      title: "Doanh số",
      dataIndex: "total",
      key: "total",
      render: (text) => <p>{text && text?.toLocaleString("vi-VN") + "đ"}</p>,
    },
    {
      title: "Số lượng bán",
      key: "sold",
      dataIndex: "sold",
    },
    {
      title: "Ngày",
      key: "date",
      dataIndex: "date",
      render: (text) => <p>{text && formatDate(text)}</p>,
    },
    {
      title: "Bắt đầu",
      key: "start",
      dataIndex: "start",
      render: (text) => <p>{formatDate(text)}</p>,
    },
    {
      title: "Kết thúc",
      key: "end",
      dataIndex: "end",
      render: (text) => <p>{formatDate(text)}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal({ open: true, id: record.platform });
            }}
          >
            Gia hạn
          </Button>
        </>
      ),
    },
  ];
  const columns1 = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => <p>{text && formatDate(text)}</p>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip1 title={text}>
          <p className={s.text_clamp}>{text}</p>
        </Tooltip1>
      ),
    },
    {
      title: "Doanh số",
      dataIndex: "total",
      key: "total",
      render: (text) => <p>{text && text?.toLocaleString("vi-VN") + "đ"}</p>,
    },
    {
      title: "Số lượng bán",
      key: "sold",
      dataIndex: "sold",
    },
    {
      title: "Doanh số theo ngày",
      key: "daily_revenue",
      dataIndex: "daily_revenue",
      render: (text) => <p>{text && text?.toLocaleString("vi-VN") + "đ"}</p>,
    },
    {
      title: "Số lượng bán theo ngày",
      key: "daily_quantity",
      dataIndex: "daily_quantity",
      render: (text) => <p>{text && text?.toLocaleString("vi-VN")}</p>,
    },
  ];
  const data = dataProduct?.map((item, index) => ({
    key: index + 1,
    platform: item.product_id,
    name: item?.latest_data?.product_name,
    total: item?.latest_data?.total_revenue,
    sold: item?.latest_data?.total_quantity_sold,
    date: item?.latest_data?.updated_date,
    image: item?.latest_data?.image_url,
    start: item?.tracking_period?.start_date,
    end: item?.tracking_period?.end_date,
  }));
  const data1 = dataProductDetail?.map((item, index) => ({
    key: index + 1,
    date: item.date,
    name: item?.product_name,
    total: item?.total_revenue,
    sold: item?.total_quantity_sold,
    daily_revenue: item?.daily_revenue,
    daily_quantity: item?.daily_quantity,
  }));
  const onFinish = (values) => {
    setLoading(true);
    const data = {
      token: localStorage.getItem("access_token"),
      data: {
        url: values.link,
        platform: values.select,
      },
    };
    fetchCheckProduct(data).then((res) => {
      setModal1(true);
      setLoading(false);
      setDataSuccess(res?.data);
    });
  };
  const onValuesChange = (changedValues) => {
    if (changedValues.select) {
      setSelectedChannel(changedValues.select); // Cập nhật giá trị khi thay đổi
    }
    if (changedValues.time) {
      setRadioDate(changedValues.time);
    }
  };
  const handleRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };
  const dataDetail = {
    labels: dataProductDetail.map((val) => formatDate(val.date)),
    datasets: [
      {
        label: "Dataset 1",
        data: dataProductDetail.map((item) => item.total_revenue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataDetail1 = {
    labels: dataProductDetail.map((val) => formatDate(val.date)),
    datasets: [
      {
        label: "Dataset 1",
        data: dataProductDetail.map((item) => item.total_quantity_sold),
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
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data1, {
      header: columns1.map((col) => col.title),
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "product_data.xlsx");
  };
  const items = [
    {
      key: "1",
      label: "Doanh số",
      children: <Line options={options} data={dataDetail} />,
    },
    {
      key: "2",
      label: "Số lượng bán",
      children: <Line options={options} data={dataDetail1} />,
    },
    {
      key: "3",
      label: "Chi tiết",
      children: (
        <>
          <Table
            columns={columns1}
            dataSource={data1}
            bordered
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            scroll={{ y: 285 }}
          />
          <Button onClick={exportToExcel}>Tải về</Button>
        </>
      ),
    },
  ];

  return (
    <div className={s.body}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Danh sách sản phẩm</h3>
        <Button
          onClick={() => {
            setModal(true);
          }}
        >
          Đăng ký
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Gắn sự kiện click vào hàng
        })}
      />
      <Modal
        open={openModal.open}
        onCancel={() => {
          setOpenModal({ open: false, id: null });
        }}
        footer={false}
        width={300}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
            gap: 20,
          }}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={7}>7 ngày</Radio>
            <Radio value={30}>30 ngày</Radio>
          </Radio.Group>
          <Button
            onClick={() => {
              const data = {
                token: localStorage.getItem("access_token"),
                data: {
                  product_id: openModal.id,
                  extend_days: value,
                },
              };
              fetchExtend(data).then((res) => {
                setOpenModal({ open: false, id: null });
              });
            }}
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
      <Modal
        open={modal}
        onCancel={() => {
          setModal(false);
        }}
        width={800}
        footer={false}
      >
        <div style={{ display: "flex", gap: 30 }}>
          <Form
            onFinish={onFinish}
            style={{
              paddingTop: 20,
              width: "100%",
              maxWidth: 200,
            }}
            onValuesChange={onValuesChange}
            form={form}
            layout="vertical"
            initialValues={{
              select: "t", // Giá trị mặc định cho Select
              time: 7, // Giá trị mặc định cho Radio
            }}
          >
            <Form.Item
              name="select"
              label="Chọn kênh bán hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kênh!",
                },
              ]}
            >
              <Select placeholder="Vui lòng chọn kênh">
                <Option value="t">Tiki</Option>
                <Option value="s">Sen đỏ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="time"
              label="Thời gian"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian!",
                },
              ]}
            >
              <Radio.Group>
                <Radio value={7}>7 ngày</Radio>
                <Radio value={30}>30 ngày</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="link"
              label="Nhập link"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập link!",
                },
                {
                  validator: (_, value) => {
                    if (
                      value &&
                      (value.includes("sendo.vn/") ||
                        value.includes("tiki.vn/"))
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Link không hợp lệ"));
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Kiểm tra
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <div>
            <p>Hướng dẫn lấy link</p>
            <img
              style={{ width: "100%" }}
              src={
                selectedChannel === "t"
                  ? "/tiki_product.jpg"
                  : "/sendo_product.jpg"
              }
            />
          </div>
        </div>
        <Modal
          open={modal1}
          footer={false}
          onCancel={() => {
            setModal1(false);
          }}
        >
          {!dataSuccess ? (
            <div>
              <p>Sản phẩm không tồn tại hoặc sai đường dẫn!</p>
              <p>Vui lòng thử lại!</p>
              <Button
                onClick={() => {
                  setModal1(false);
                }}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 20 }}>
                <div>
                  <p>Đã tìm thấy thông tin:</p>
                  <p>Tên: {dataSuccess.product_name}</p>
                  <p>Url: {dataSuccess.url}</p>
                </div>
                <img src={dataSuccess.image} alt="product" />
              </div>
              <Button
                onClick={() => {
                  const data = {
                    token: localStorage.getItem("access_token"),
                    data: {
                      product_id: dataSuccess.product_id,
                      product_url: dataSuccess.url,
                      time: radioDate,
                    },
                  };
                  fetchAddProduct(data).then((res) => {
                    const data1 = {
                      token: localStorage.getItem("access_token"),
                    };
                    fetchProductData(data1).then((res) => {
                      setDataProduct(res.data.tracked_products);
                    });
                    setModal1(false);

                    setTimeout(() => {
                      setModal(false);
                    }, 200);
                  });
                }}
              >
                Xác nhận
              </Button>
            </div>
          )}
        </Modal>
      </Modal>
      <Modal
        style={{ top: 60 }}
        footer={false}
        open={isModalVisible}
        width={900}
        onCancel={() => setIsModalVisible(false)}
      >
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </div>
  );
}
const formatDate = (dateString) => {
  const date = new Date(dateString); // Tạo đối tượng ngày
  const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày, thêm số 0 nếu cần
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng (cộng 1 vì getMonth() trả về 0-11)
  const year = date.getFullYear(); // Lấy năm
  return `${day}/${month}/${year}`; // Trả về chuỗi định dạng dd/mm/yyyy
};
