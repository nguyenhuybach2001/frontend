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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function TrackingShop() {
  const [dataShop, setDataShop] = useState([]);
  const [dataShopDetail, setDataShopDetail] = useState([]);
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
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const fetchShopData = async (data) => {
    const response = await apiCaller({
      request: trackingApi.dataSHop(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchAddShop = async (data) => {
    const response = await apiCaller({
      request: trackingApi.add_shop(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchCheckShop = async (data) => {
    const response = await apiCaller({
      request: trackingApi.check_shop(data),
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
      request: trackingApi.extendDate(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      fetchShopData(data).then((res) => {
        setDataShop(res.data.tracked_shops);
      });
      return response;
    }

    return null;
  };
  const fetchShopDetail = async (data) => {
    const response = await apiCaller({
      request: trackingApi.detail_shop(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      fetchShopData(data).then((res) => {
        setDataShop(res.data.tracked_shops);
      });
      return response;
    }

    return null;
  };
  useEffect(() => {
    const data = {
      token: localStorage.getItem("access_token"),
      shop_id: selectedRow?.platform,
    };
    selectedRow &&
      fetchShopDetail(data).then((res) => {
        setDataShopDetail(res.data?.revenue_data);
        console.log(res.data?.revenue_data);
      });
  }, [selectedRow]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const data = { token: token };
    fetchShopData(data).then((res) => {
      setDataShop(res.data?.tracked_shops);
    });
  }, []);
  const columns = [
    {
      title: "Nền tảng",
      dataIndex: "platform",
      key: "platform",
      render: (text) => <p>{text.includes("t") ? "Tiki" : "Sen đỏ"}</p>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
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
        <Button
          onClick={() => {
            setOpenModal({ open: true, id: record.platform });
          }}
        >
          Gia hạn
        </Button>
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
  const data = dataShop?.map((item, index) => ({
    key: index + 1,
    platform: item.shop_id,
    name: item?.latest_data?.shop_name,
    total: item?.latest_data?.total_revenue,
    sold: item?.latest_data?.total_quantity_sold,
    date: item?.latest_data?.date,
    start: item?.tracking_period?.start_date,
    end: item?.tracking_period?.end_date,
  }));
  const data1 = dataShopDetail?.map((item, index) => ({
    key: index + 1,
    date: item.date,
    name: item?.shop_name,
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
    fetchCheckShop(data).then((res) => {
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
    labels: dataShopDetail.map((val) => formatDate(val.date)),
    datasets: [
      {
        label: "Dataset 1",
        data: dataShopDetail.map((item) => item.total_revenue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataDetail1 = {
    labels: dataShopDetail.map((val) => formatDate(val.date)),
    datasets: [
      {
        label: "Dataset 1",
        data: dataShopDetail.map((item) => item.total_quantity_sold),
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
    XLSX.writeFile(wb, "shop_data.xlsx");
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
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
        <h3>Danh sách cửa hàng</h3>
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
                  shop_id: openModal.id,
                  extend_days: value,
                },
              };
              fetchExtend(data).then((res) => {
                console.log(res);
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
                      (value.includes("https://www.sendo.vn/") ||
                        value.includes("https://www.tiki.vn/"))
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
                selectedChannel === "t" ? "/tiki_shop.png" : "/sendo_shop.png"
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
              <p>Đã tìm thấy thông tin:</p>
              <p>Tên: {dataSuccess.shop_name}</p>
              <p>Url: {dataSuccess.url}</p>
              <Button
                onClick={() => {
                  const data = {
                    token: localStorage.getItem("access_token"),
                    data: {
                      shop_id: dataSuccess.shop_id,
                      shop_url: dataSuccess.url,
                      time: radioDate,
                    },
                  };
                  fetchAddShop(data).then((res) => {
                    const data1 = {
                      token: localStorage.getItem("access_token"),
                    };
                    fetchShopData(data1).then((res) => {
                      setDataShop(res.data.tracked_shops);
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
