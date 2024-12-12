import React, { useEffect, useState } from "react";
import s from "./analysis.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Tabs } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import apiCaller from "../../api/apiCaller";
import { analysisApi } from "../../api/analysisApi";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options1 = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Doanh số theo ngành hàng",
      font: {
        size: 24,
        weight: "bold",
        family: "Arial",
      },
      color: "#333333",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Doanh số (Đồng)", 
        font: {
          size: 16,
          weight: "bold",
          family: "Arial",
        },
        color: "#555555", 
      },
    },
    y: {
      title: {
        display: true,
        text: "Ngành hàng", 
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

const options2 = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Số sản phẩm đã bán",
      font: {
        size: 24,
        weight: "bold",
        family: "Arial",
      },
      color: "#333333",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Số lượng",
        font: {
          size: 16,
          weight: "bold",
          family: "Arial",
        },
        color: "#555555", 
      },
    },
    y: {
      title: {
        display: true,
        text: "Ngành hàng", 
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
const options3 = {
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Doanh số theo mức giá",
      font: {
        size: 24,
        weight: "bold",
        family: "Arial",
      },
      color: "#333333",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Doanh số (Đồng)", 
        font: {
          size: 16,
          weight: "bold",
          family: "Arial",
        },
        color: "#555555", 
      },
    },
    y: {
      title: {
        display: true,
        text: "Mức giá", 
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
const options4 = {
  plugins: {
    legend: {
      position: "bottom", // Legend nằm bên phải
      labels: {
        boxWidth: 10, // Kích thước ô màu
        padding: 15, // Khoảng cách giữa các nhãn
        usePointStyle: true, // Hiển thị hình tròn thay vì ô vuông
        generateLabels: (chart) => {
          const data = chart.data;
          return data.labels.map((label, index) => ({
            text: label,
            fillStyle: data.datasets[0].backgroundColor[index],
          }));
        },
      },
    },
    title: {
      display: true,
      text: "Top 20 cửa hàng",
      font: {
        size: 24,
        weight: "bold",
        family: "Arial",
      },
      color: "#333333",
    },
  },
  layout: {
    padding: {
      right: 5, // Khoảng cách giữa biểu đồ và legend
    },
  },
};
function getRandomLightColor() {
  const hue = Math.floor(Math.random() * 360); // Dải màu ngẫu nhiên
  const saturation = 80 + Math.random() * 20; // Tăng độ bão hòa từ 80% - 100%
  const lightness = 50 + Math.random() * 10; // Độ sáng vừa phải từ 50% - 60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateLightColors(length) {
  return Array.from({ length }, () => getRandomLightColor());
}

export default function AnalysisScreen() {
  const [type, setType] = useState("t");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const backgroundColors = generateLightColors(data2.length);

  const fetchRevenue = async (data) => {
    const response = await apiCaller({
      request: analysisApi.revenue(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchShopRevenue = async (data) => {
    const response = await apiCaller({
      request: analysisApi.shop_revenue(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchCategory_qtt_sold = async (data) => {
    const response = await apiCaller({
      request: analysisApi.category_qtt_sold(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchTiki_price_rage = async (data) => {
    const response = await apiCaller({
      request: analysisApi.tiki_price_rage(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchSendo_price_rage = async (data) => {
    const response = await apiCaller({
      request: analysisApi.sendo_price_rage(data),
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
    
    const token = localStorage.getItem("access_token");
    const data = { token: token, type: type };
    fetchRevenue(data).then((res) => {
      setData1(res.data);
    });
    fetchShopRevenue(data).then((res) => {
      setData2(res.data);
    });
    fetchCategory_qtt_sold(data).then((res) => {
      setData3(res.data);
    });
    type === "t" &&
      fetchTiki_price_rage(data).then((res) => {
        setData4(res.data?.list);
        console.log(res.data);
      });
    type === "s" &&
      fetchSendo_price_rage(data).then((res) => {
        setData5(res.data?.list);
        console.log(res.data);
      });
    setLoadingPage(false)
  }, [type]);

  const dataList1 = {
    labels: data1.map((val) => val.category_name),
    datasets: [
      {
        label: "",
        data: data1.map((val) => val.total_revenue),
        borderColor: "rgb(0, 0, 0, 0)",
        backgroundColor: data1.map((_, index) => {
          const ctx = document.getElementById("chart1").getContext("2d");
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          if (type === "t") {
            gradient.addColorStop(0, "rgba(0,0,255,1)");
            gradient.addColorStop(1, "rgba(0,212,255,1)");
          } else if (type === "s") {
            gradient.addColorStop(0, "rgba(255,0,0,1)");
            gradient.addColorStop(1, "rgba(255,165,0,1)");
          }
          return gradient;
        }),
      },
    ],
  };

  const dataList3 = {
    labels: data3.map((val) => val.category_name),
    datasets: [
      {
        label: "",
        data: data3.map((val) => val.total_quantity_sold),
        borderColor: "rgb(0, 0, 0, 0)",
        backgroundColor: data1.map((_, index) => {
          const ctx = document.getElementById("chart2").getContext("2d");
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          if (type === "t") {
            gradient.addColorStop(0, "rgba(0,0,255,1)");
            gradient.addColorStop(1, "rgba(0,212,255,1)");
          } else if (type === "s") {
            gradient.addColorStop(0, "rgba(255,0,0,1)");
            gradient.addColorStop(1, "rgba(255,165,0,1)");
          }
          return gradient;
        }),
      },
    ],
  };
  const dataList4 = {
    labels: (type == "t" ? data4 : data5).map((val) => val.price_range),
    datasets: [
      {
        label: "",
        data: (type == "t" ? data4 : data5).map((val) => val.total_sales),
        borderColor: "rgb(0, 0, 0, 0)",
        backgroundColor: data1.map((_, index) => {
          const ctx = document.getElementById("chart3").getContext("2d");
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          if (type === "t") {
            gradient.addColorStop(0, "rgba(0,0,255,1)");
            gradient.addColorStop(1, "rgba(0,212,255,1)");
          } else if (type === "s") {
            gradient.addColorStop(0, "rgba(255,0,0,1)");
            gradient.addColorStop(1, "rgba(255,165,0,1)");
          }
          return gradient;
        }),
      },
    ],
  };
  const dataList2 = {
    labels: data2.map((val) => val.shop_name),
    datasets: [
      {
        label: "",
        data: data2.map((val) => val.total_revenue),
        backgroundColor: backgroundColors,
      },
    ],
  };
  const items1 = [
    {
      key: "1",
      label: "Tiki",
      children: (
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginBottom: "50px" }}>
            <Bar id="chart1" options={options1} data={dataList1} />
          </div>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginBottom: "50px" }}>
            <Bar id="chart2" options={options2} data={dataList3} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
            {/* Biểu đồ Chart3 */}
            <div style={{ flex: 1, maxWidth: "50%", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginRight: "10px" }}>
              <Bar id="chart3" options={options3} data={dataList4} />
            </div>
            {/* Biểu đồ Doughnut */}
            <div style={{ flex: 1, maxWidth: "50%", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginLeft: "10px" }}>
              <Doughnut
                style={{ margin: "auto" }}
                width={500}
                height={500}
                data={dataList2}
                options={options4}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Sendo",
      children: (
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginBottom: "50px" }}>
            <Bar id="chart1" options={options1} data={dataList1} />
          </div>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginBottom: "50px" }}>
            <Bar id="chart2" options={options2} data={dataList3} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
            {/* Biểu đồ Chart3 */}
            <div style={{ flex: 1, maxWidth: "50%", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginRight: "10px" }}>
              <Bar id="chart3" options={options3} data={dataList4} />
            </div>
            {/* Biểu đồ Doughnut */}
            <div style={{ flex: 1, maxWidth: "50%", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px", marginLeft: "10px" }}>
              <Doughnut
                style={{ margin: "auto" }}
                width={500}
                height={500}
                data={dataList2}
                options={options4}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className={s.body}>
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
      </Flex>) : (
        <Tabs
          defaultActiveKey="1"
          items={items1}
          tabBarStyle={{
            fontSize: "18px", // Tăng kích thước chữ
            fontWeight: "bold", // Tùy chọn, làm chữ đậm hơn
          }}
          onChange={(e) => {
            if (e == "1") {
              setType("t");
            } else if (e == "2") {
              setType("s");
            }
          }}
        />)}
    </div>
  );
}
